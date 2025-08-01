import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    // Check if doctor exists
    const doctor = await this.doctorsService.findOne(createAppointmentDto.doctorId);
    
    // Validate appointment times
    if (createAppointmentDto.startTime >= createAppointmentDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
    
    // Check for overlapping appointments
    const overlappingAppointments = await this.appointmentsRepository.find({
      where: {
        doctorId: createAppointmentDto.doctorId,
        status: 'scheduled',
        startTime: Between(
          new Date(createAppointmentDto.startTime.getTime() - 1),
          new Date(createAppointmentDto.endTime.getTime() + 1),
        ),
      },
    });
    
    // Check if there are any overlapping appointments
    const isOverlapping = overlappingAppointments.some(appointment => {
      return (
        (createAppointmentDto.startTime >= appointment.startTime && createAppointmentDto.startTime < appointment.endTime) ||
        (createAppointmentDto.endTime > appointment.startTime && createAppointmentDto.endTime <= appointment.endTime) ||
        (createAppointmentDto.startTime <= appointment.startTime && createAppointmentDto.endTime >= appointment.endTime)
      );
    });
    
    if (isOverlapping) {
      throw new BadRequestException('The selected time slot is not available. Please choose another time.');
    }
    
    // Create and save the appointment
    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      doctor,
    });
    
    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: ['doctor'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    
    return appointment;
  }

  async findByDoctor(doctorId: number): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { doctorId },
      relations: ['doctor'],
    });
  }
}
