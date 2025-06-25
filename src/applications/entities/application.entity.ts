import { User } from 'src/users/user.entity'
import { Job } from 'src/jobs/entities/job.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  jobId: number

  @Column()
  resumePath: string

  @Column({ nullable: true })
  coverLetterPath?: string

  @CreateDateColumn()
  submittedAt: Date

  @ManyToOne(() => User, (user) => user.applications, {
    cascade: ['insert', 'update', 'recover'],
  })
  applicant: User

  @ManyToOne(() => Job, (job) => job.applications, {
    cascade: ['insert', 'update', 'recover'],
  })
  job: Job
}
