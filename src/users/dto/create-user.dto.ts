import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name.',
    example: 'Raihan',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: 'User last name.',
    example: 'Ali',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: 'Unique email address for the account.',
    example: 'raihan@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description:
      'Password with at least 8 characters including uppercase, lowercase, number, and special character.',
    minLength: 8,
    example: 'P@ssw0rd123',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password!: string;

  @ApiPropertyOptional({
    description: 'Object storage key for the user avatar.',
    example: 'avatars/users/6d4e8a0a.png',
  })
  @IsOptional()
  @IsString()
  avatarKey?: string;

  @ApiPropertyOptional({
    description: 'Phone number in E.164 format.',
    example: '+8801712345678',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Phone must be in E.164 format' })
  phone?: string;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'Role cannot be assigned from this route. This endpoint only creates CUSTOMER accounts.',
  })
  role?: never;
}
