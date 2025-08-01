import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment booked successfully', type: Appointment })
  @ApiResponse({ status: 400, description: 'Invalid appointment data or time slot not available' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments', type: [Appointment] })
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by id' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Return an appointment by id', type: Appointment })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Get all appointments for a doctor' })
  @ApiParam({ name: 'doctorId', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Return all appointments for a doctor', type: [Appointment] })
  findByDoctor(@Param('doctorId', ParseIntPipe) doctorId: number): Promise<Appointment[]> {
    return this.appointmentsService.findByDoctor(doctorId);
  }
}
