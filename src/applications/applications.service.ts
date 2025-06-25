import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common'
import { UpdateApplicationDto } from './dto/update-application.dto'
import { UserWithoutPassword, UserRole } from 'src/users/user.entity'
import { QueryFailedError, Repository } from 'typeorm'
import { Application } from './entities/application.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
  ) {}

  async create(
    jobId: number,
    applicant: UserWithoutPassword,
    resume?: Express.Multer.File[],
    coverLetter?: Express.Multer.File[],
  ) {
    // Only job seekers can create applications
    if (applicant.role !== UserRole.JOB_SEEKER) {
      throw new ForbiddenException('Only job seekers can create applications')
    }

    if (!resume || resume.length === 0) {
      throw new BadRequestException('Resume is required')
    }

    const application = this.applicationRepository.create({
      jobId,
      applicant,
      resumePath: '/uploads/' + resume[0].filename,
      coverLetterPath:
        coverLetter && coverLetter.length > 0
          ? '/uploads/' + coverLetter[0].filename
          : undefined,
    })

    try {
      return await this.applicationRepository.save(application)
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.toLowerCase().includes('duplicate')) {
          throw new ConflictException('You have already applied to this job')
        }
      }
      throw error
    }
  }

  async findAll(applicant: UserWithoutPassword): Promise<Application[]> {
    // Job seekers can only see their own applications
    // Employers can see applications for their jobs
    // Admins can see all applications
    if (applicant.role === UserRole.JOB_SEEKER) {
      return this.applicationRepository.find({
        where: { applicant: { id: applicant.id } },
        relations: ['job', 'applicant'],
      })
    } else if (applicant.role === UserRole.EMPLOYER) {
      return this.applicationRepository.find({
        where: { job: { employer: { id: applicant.id } } },
        relations: ['job', 'applicant'],
      })
    } else if (applicant.role === UserRole.ADMIN) {
      return this.applicationRepository.find({
        relations: ['job', 'applicant'],
      })
    }

    throw new ForbiddenException(
      'You do not have permission to view applications',
    )
  }

  async findOne(
    id: number,
    applicant: UserWithoutPassword,
  ): Promise<Application> {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['job', 'applicant', 'job.employer'],
    })

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`)
    }

    // Job seekers can only see their own applications
    // Employers can see applications for their jobs
    // Admins can see all applications
    if (applicant.role === UserRole.JOB_SEEKER) {
      if (application.applicant.id !== applicant.id) {
        throw new ForbiddenException(
          'You do not have permission to view this application',
        )
      }
    } else if (applicant.role === UserRole.EMPLOYER) {
      if (application.job.employer.id !== applicant.id) {
        throw new ForbiddenException(
          'You do not have permission to view this application',
        )
      }
    } else if (applicant.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to view applications',
      )
    }

    return application
  }

  async update(
    id: number,
    updateApplicationDto: UpdateApplicationDto,
    applicant: UserWithoutPassword,
    resume?: Express.Multer.File[],
    coverLetter?: Express.Multer.File[],
  ) {
    const application = await this.findOne(id, applicant)

    // Job seekers can only update their own applications
    // Employers can update applications for their jobs
    // Admins can update any application
    if (applicant.role === UserRole.JOB_SEEKER) {
      if (application.applicant.id !== applicant.id) {
        throw new ForbiddenException(
          'You do not have permission to update this application',
        )
      }
    } else if (applicant.role === UserRole.EMPLOYER) {
      if (application.job.employer.id !== applicant.id) {
        throw new ForbiddenException(
          'You do not have permission to update this application',
        )
      }
    } else if (applicant.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to update applications',
      )
    }

    Object.assign(application, updateApplicationDto)
    if (resume && resume.length > 0) {
      application.resumePath = '/uploads/' + resume[0].filename
    }
    if (coverLetter && coverLetter.length > 0) {
      application.coverLetterPath = '/uploads/' + coverLetter[0].filename
    }
    return await this.applicationRepository.save(application)
  }

  async remove(
    id: number,
    applicant: UserWithoutPassword,
  ): Promise<{ message: string }> {
    const application = await this.findOne(id, applicant)

    // Job seekers can only delete their own applications
    // Employers can delete applications for their jobs
    // Admins can delete any application
    if (applicant.role === UserRole.JOB_SEEKER) {
      if (application.applicant.id !== applicant.id) {
        throw new ForbiddenException(
          'You do not have permission to delete this application',
        )
      }
    } else if (applicant.role === UserRole.EMPLOYER) {
      if (application.job.employer.id !== applicant.id) {
        throw new ForbiddenException(
          'You do not have permission to delete this application',
        )
      }
    } else if (applicant.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to delete applications',
      )
    }

    const result = await this.applicationRepository.delete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Application with ID ${id} not found`)
    }

    return { message: `Application with ID ${id} deleted successfully` }
  }

  async findApplications(jobId: number, employer: UserWithoutPassword) {
    if (employer.role !== UserRole.EMPLOYER) {
      throw new ForbiddenException(
        "You are not authorized to view this job's applications",
      )
    }

    const applications = await this.applicationRepository.find({
      where: { job: { id: jobId, employer: { id: employer.id } } },
      relations: ['job', 'applicant', 'job.employer'],
    })

    return applications
  }

  async findMyApplications(applicant: UserWithoutPassword) {
    if (applicant.role !== UserRole.JOB_SEEKER) {
      throw new ForbiddenException(
        'You are not authorized to view your applications',
      )
    }

    const applications = await this.applicationRepository.find({
      where: { applicant: { id: applicant.id } },
      relations: ['job', 'applicant', 'job.employer'],
    })

    return applications
  }
}
