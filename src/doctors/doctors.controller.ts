import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Return all doctors', type: [Doctor] })
  findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor by id' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Return a doctor by id', type: Doctor })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return this.doctorsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created successfully', type: Doctor })
  create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get(':id/slots')
  @ApiOperation({ summary: 'Get available time slots for a doctor' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiQuery({ name: 'date', required: false, description: 'Date in ISO format (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Return available time slots' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  getAvailableTimeSlots(
    @Param('id', ParseIntPipe) id: number,
    @Query('date') dateString?: string,
  ): Promise<{ startTime: Date; endTime: Date }[]> {
    // If date is not provided, use current date
    const date = dateString ? new Date(dateString) : new Date();
    return this.doctorsService.getAvailableTimeSlots(id, date);
  }
}
