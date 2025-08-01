import { IsString, IsEmail, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ description: 'Doctor name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Doctor email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Doctor phone number', required: false, example: '123-456-7890' })
  @IsOptional()
  @Matches(/^(\+[1-9]{1}[0-9]{3,14}|[0-9]{3}-[0-9]{3}-[0-9]{4})$/, {
    message: 'Phone number must be in a valid format (e.g., 123-456-7890 or +919876543210)'
  })
  phone?: string;

  @ApiProperty({ description: 'Doctor active status', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
