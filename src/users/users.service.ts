import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John', email: 'john@mail.com', role: 'admin' },
    { id: 2, name: 'jane', email: 'jane@mail.com', role: 'engineer' },
    { id: 3, name: 'Doe', email: 'doe@mail.com', role: 'engineer' },
    { id: 4, name: 'Smith', email: 'smith@mail.com', role: 'intern' },
  ];

  findAll(role?: 'intern' | 'engineer' | 'admin' | '') {
    // If the role parameter is provided as an empty string, throw an error.
    if (role === '') {
      throw new BadRequestException('Role parameter cannot be empty');
    }
    // If role is provided (and not an empty string), filter by role.
    if (role !== undefined) {
      const rolesArray = this.users.filter((user) => user.role === role);
      if (rolesArray.length === 0) {
        throw new NotFoundException('User Role Not Found');
      }
      return rolesArray;
    }
    // If no role parameter was provided at all, return all users.
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }

  create(createUserDto: CreateUserDto) {
    const usersByHighestId = [...this.users].sort((a, b) => b.id - a.id);
    const newUser = {
      id: usersByHighestId[0].id + 1,
      ...createUserDto,
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return { ...user, ...updateUserDto };
      }
      return user;
    });

    return this.findOne(id);
  }

  delete(id: number) {
    const removedUser = this.findOne(id);
    this.users = this.users.filter((user) => user.id !== id);
    return removedUser;
  }
}
