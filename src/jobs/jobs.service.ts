import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Job } from './entities/job.entity'
import { Repository } from 'typeorm'
import { UsersService } from '../users/users.service'
import { UserRole } from 'src/users/user.entity'
import {
  ListJobsDto,
  ListJobsResponse,
  SortField,
  SortOrder,
} from './dto/list-jobs.dto'

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly usersService: UsersService,
  ) {}

  async create(createJobDto: CreateJobDto): Promise<Job> {
    const employer = await this.usersService.findOne(createJobDto.employerId)
    if (!employer) {
      throw new NotFoundException(
        `Employer with ID ${createJobDto.employerId} not found`,
      )
    }
    if (!(employer.role === UserRole.EMPLOYER)) {
      throw new NotFoundException(
        `User with ID ${createJobDto.employerId} is not an employer`,
      )
    }

    const job = this.jobRepository.create({
      ...createJobDto,
      employer: { id: createJobDto.employerId },
    })

    return this.jobRepository.save(job)
  }

  async findAll(listJobsDto: ListJobsDto): Promise<ListJobsResponse> {
    const queryBuilder = this.jobRepository.createQueryBuilder('job')

    // Apply filter parameters
    if (listJobsDto.jobType) {
      queryBuilder.andWhere('job.jobType = :jobType', {
        jobType: listJobsDto.jobType,
      })
    }

    if (listJobsDto.title) {
      queryBuilder.andWhere('job.title ILIKE :title', {
        title: `%${listJobsDto.title}%`,
      })
    }

    if (listJobsDto.location) {
      queryBuilder.andWhere('job.location ILIKE :location', {
        location: `%${listJobsDto.location}%`,
      })
    }

    if (listJobsDto.minSalary) {
      queryBuilder.andWhere('job.minSalary >= :minSalary', {
        minSalary: listJobsDto.minSalary,
      })
    }

    if (listJobsDto.maxSalary) {
      queryBuilder.andWhere('job.maxSalary <= :maxSalary', {
        maxSalary: listJobsDto.maxSalary,
      })
    }

    // Apply sorting parameters
    const sortField = listJobsDto.sortBy || SortField.DATE
    const sortBy = {
      [SortField.TITLE]: 'title',
      [SortField.LOCATION]: 'location',
      [SortField.MIN_SALARY]: 'minSalary',
      [SortField.MAX_SALARY]: 'maxSalary',
      [SortField.JOB_TYPE]: 'jobType',
      [SortField.DATE]: 'datePosted',
    }[sortField]

    const sortOrder = listJobsDto.sortOrder || SortOrder.DESC
    queryBuilder.orderBy(
      `job.${sortBy}`,
      sortOrder.toUpperCase() as 'ASC' | 'DESC',
    )
    queryBuilder.addOrderBy('job.datePosted', 'DESC')

    // Apply pagination parameters
    const currentPage = listJobsDto.page || 1
    const limit = listJobsDto.limit || 10
    const offset = (currentPage - 1) * limit
    queryBuilder.skip(offset).take(limit)

    const [jobs, totalJobs] = await queryBuilder.getManyAndCount()
    const totalPages = Math.ceil(totalJobs / limit)
    const hasNextPage = currentPage < totalPages

    return {
      jobs,
      totalJobs,
      totalPages,
      currentPage,
      hasNextPage,
    }
  }

  async findOne(id: number): Promise<Job> {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['employer'],
    })

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`)
    }

    return job
  }

  async update(
    id: number,
    updateJobDto: UpdateJobDto,
    userId?: number,
  ): Promise<Job> {
    const job = await this.findOne(id)

    if (userId && job.employer.id !== userId) {
      throw new ForbiddenException(
        `You do not have permission to update this job`,
      )
    }

    if (updateJobDto.employerId) {
      const employer = await this.usersService.findOne(updateJobDto.employerId)
      if (!employer) {
        throw new NotFoundException(
          `Employer with ID ${updateJobDto.employerId} not found`,
        )
      }
    }

    const updatedJob = this.jobRepository.merge(job, {
      ...updateJobDto,
      ...(updateJobDto.employerId
        ? { employer: { id: updateJobDto.employerId } }
        : {}),
    })

    return this.jobRepository.save(updatedJob)
  }

  async remove(id: number, userId?: number): Promise<{ message: string }> {
    if (userId) {
      const job = await this.findOne(id)
      if (job.employer.id !== userId) {
        throw new ForbiddenException(
          `You do not have permission to delete this job`,
        )
      }
    }

    const result = await this.jobRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`)
    }

    return { message: `Job with ID ${id} deleted successfully` }
  }
}
