import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/common/guards'
import { UserWithoutPassword } from './user.entity'
import { ApiTags, ApiResponse, ApiConsumes } from '@nestjs/swagger'
import { UserResponseDto } from '../auth/dto/auth-response.dto'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'List all users.',
    type: [UserResponseDto],
  })
  findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get a user by ID.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiConsumes('application/json')
  @ApiResponse({
    status: 200,
    description: 'Update a user.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.id !== +id) throw new UnauthorizedException()
    return this.usersService.update(id, updateUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Delete a user.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: UserWithoutPassword },
  ) {
    if (req.user.id !== +id) throw new UnauthorizedException()
    return this.usersService.remove(id)
  }
}
