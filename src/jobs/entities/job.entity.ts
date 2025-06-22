import { User } from 'src/users/user.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number

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

  @Column()
  jobType: string

  @ManyToOne(() => User, (user) => user.jobs, {
    cascade: ['insert', 'update', 'recover'],
  })
  employer: User
}
