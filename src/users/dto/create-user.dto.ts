import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['intern', 'engineer', 'admin'], {
    message: 'Role must be either intern, engineer, or admin',
  })
  role: 'intern' | 'engineer' | 'admin';
}
