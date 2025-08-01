import { IsString, IsEmail, IsOptional, IsDate, IsNumber, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'Patient name' })
  @IsString()
  patientName: string;

  @ApiProperty({ description: 'Patient email', required: false })
  @IsEmail()
  @IsOptional()
  patientEmail?: string;

  @ApiProperty({ description: 'Patient phone number', required: false, example: '123-456-7890' })
  @IsOptional()
  @Matches(/^(\+[1-9]{1}[0-9]{3,14}|[0-9]{3}-[0-9]{3}-[0-9]{4})$/, {
    message: 'Phone number must be in a valid format (e.g., 123-456-7890 or +919876543210)'
  })
  patientPhone?: string;

  @ApiProperty({ description: 'Appointment start time' })
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({ description: 'Appointment end time' })
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({ description: 'Doctor ID' })
  @IsNumber()
  doctorId: number;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
