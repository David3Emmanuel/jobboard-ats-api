import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  passwordHash: string
}

export type UserWithoutPassword = Omit<User, 'passwordHash'>
export function stripPassword(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user
  return userWithoutPassword as UserWithoutPassword
}
