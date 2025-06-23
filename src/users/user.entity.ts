import { Job } from 'src/jobs/entities/job.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

export enum UserRole {
  EMPLOYER = 'employer',
  JOB_SEEKER = 'job-seeker',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  passwordHash: string

  @Column({ enum: UserRole, default: UserRole.JOB_SEEKER })
  role: UserRole

  @OneToMany(() => Job, (job) => job.employer, { cascade: true })
  jobs: Job[]
}

export type UserWithoutPassword = Omit<User, 'passwordHash'>
export function stripPassword(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword as UserWithoutPassword
}
