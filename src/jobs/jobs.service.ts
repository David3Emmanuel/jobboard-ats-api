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

  async findAll(): Promise<Job[]> {
    return this.jobRepository.find({
      relations: ['employer'],
    })
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
