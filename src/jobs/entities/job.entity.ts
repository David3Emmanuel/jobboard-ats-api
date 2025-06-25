import { User } from 'src/users/user.entity'
import { Application } from 'src/applications/entities/application.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'

export enum JobType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  VOLUNTEER = 'volunteer',
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number

  @CreateDateColumn()
  datePosted: Date

  @Column()
  title: string

  @Column({ nullable: true })
  description?: string

  @Column()
  location: string

  @Column()
  minSalary: number

  @Column()
  maxSalary: number

  @Column({ enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType

  @ManyToOne(() => User, (user) => user.jobs, {
    cascade: ['insert', 'update', 'recover'],
  })
  employer: User

  @OneToMany(() => Application, (application) => application.job, {
    cascade: true,
  })
  applications: Application[]
}
