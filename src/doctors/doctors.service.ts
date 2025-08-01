import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const doctor = this.doctorsRepository.create(createDoctorDto);
    return this.doctorsRepository.save(doctor);
  }

  async getAvailableTimeSlots(doctorId: number, date: Date): Promise<{ startTime: Date; endTime: Date }[]> {
    // Find the doctor
    const doctor = await this.findOne(doctorId);
    
    // Set the start and end of the requested date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all appointments for the doctor on the specified date
    const appointments = await this.appointmentsRepository.find({
      where: {
        doctorId,
        startTime: Between(startOfDay, endOfDay),
      },
      order: {
        startTime: 'ASC',
      },
    });
    
    // Define working hours (e.g., 9 AM to 5 PM)
    const workStartHour = 9;
    const workEndHour = 17;
    
    // Define appointment duration in minutes
    const appointmentDuration = 30;
    
    // Generate all possible time slots
    const availableSlots: { startTime: Date; endTime: Date }[] = [];
    
    // Start from work start time
    const currentDate = new Date(date);
    currentDate.setHours(workStartHour, 0, 0, 0);
    
    // End at work end time
    const endTime = new Date(date);
    endTime.setHours(workEndHour, 0, 0, 0);
    
    // Generate slots until end of work day
    while (currentDate < endTime) {
      const slotStart = new Date(currentDate);
      
      // Calculate slot end time
      const slotEnd = new Date(currentDate);
      slotEnd.setMinutes(slotEnd.getMinutes() + appointmentDuration);
      
      // Move to next slot
      currentDate.setMinutes(currentDate.getMinutes() + appointmentDuration);
      
      // Check if this slot overlaps with any existing appointment
      const isOverlapping = appointments.some(appointment => {
        return (
          (slotStart >= appointment.startTime && slotStart < appointment.endTime) ||
          (slotEnd > appointment.startTime && slotEnd <= appointment.endTime) ||
          (slotStart <= appointment.startTime && slotEnd >= appointment.endTime)
        );
      });
      
      // If not overlapping, add to available slots
      if (!isOverlapping) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd,
        });
      }
    }
    
    return availableSlots;
  }
}
