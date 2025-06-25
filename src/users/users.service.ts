import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, stripPassword } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto
    const user = this.userRepository.create({
      ...rest,
      passwordHash: password, // TODO Hash the password before saving
    })
    const newUser = await this.userRepository.save(user)
    return stripPassword(newUser)
  }

  async findAll() {
    return (await this.userRepository.find()).map(stripPassword)
  }

  async findOne(id: number) {
    const found = await this.userRepository.findOneBy({ id })
    return found ? stripPassword(found) : null
  }

  async findByUsername(username: string) {
    const found = await this.userRepository.findOneBy({ username })
    return found ? stripPassword(found) : null
  }

  async confirmUsernameAndPassword(username: string, password: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.username = :username', { username })
      .getOne()

    if (user && user.passwordHash === password) {
      return stripPassword(user)
    }
    return null
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(id, updateUserDto)
    if (result.affected === 0) return null
    const updatedUser = await this.userRepository.findOneBy({ id })
    return updatedUser ? stripPassword(updatedUser) : null
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id)
    if (result.affected === 0) return null
    return { message: `User with id ${id} deleted successfully` }
  }
}
