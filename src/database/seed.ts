import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DoctorsService } from '../doctors/doctors.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { Doctor } from '../doctors/entities/doctor.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const doctorsService = app.get(DoctorsService);
  const appointmentsService = app.get(AppointmentsService);

  // Create sample doctors
  const doctors = [
    {
      name: 'Dr. John Smith',
      email: 'john.smith@example.com',
      phone: '123-456-7890',
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '123-456-7891',
    },
    {
      name: 'Dr. Michael Brown',
      email: 'michael.brown@example.com',
      phone: '123-456-7892',
    },
    {
      name: 'Dr. Emily Davis',
      email: 'emily.davis@example.com',
      phone: '123-456-7893',
    },
    {
      name: 'Dr. Robert Wilson',
      email: 'robert.wilson@example.com',
      phone: '123-456-7894',
    },
  ];

  console.log('Seeding doctors...');
  const createdDoctors: Doctor[] = [];
  for (const doctor of doctors) {
    const createdDoctor = await doctorsService.create(doctor);
    createdDoctors.push(createdDoctor);
    console.log(`Created doctor: ${createdDoctor.name}`);
  }

  // Create sample appointments
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Create a few appointments for the first doctor
  const appointments = [
    {
      patientName: 'Alice Johnson',
      patientEmail: 'alice@example.com',
      patientPhone: '555-123-4567',
      startTime: new Date(today.setHours(10, 0, 0, 0)),
      endTime: new Date(today.setHours(10, 30, 0, 0)),
      doctorId: createdDoctors[0].id,
      notes: 'Regular checkup',
    },
    {
      patientName: 'Bob Smith',
      patientEmail: 'bob@example.com',
      patientPhone: '555-123-4568',
      startTime: new Date(today.setHours(11, 0, 0, 0)),
      endTime: new Date(today.setHours(11, 30, 0, 0)),
      doctorId: createdDoctors[0].id,
      notes: 'Follow-up appointment',
    },
    {
      patientName: 'Charlie Brown',
      patientEmail: 'charlie@example.com',
      patientPhone: '555-123-4569',
      startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(14, 30, 0, 0)),
      doctorId: createdDoctors[1].id,
      notes: 'New patient consultation',
    },
  ];

  console.log('Seeding appointments...');
  for (const appointment of appointments) {
    try {
      const createdAppointment = await appointmentsService.create(appointment);
      console.log(`Created appointment for ${createdAppointment.patientName} with Dr. ${createdAppointment.doctor.name}`);
    } catch (error) {
      console.error(`Failed to create appointment: ${error.message}`);
    }
  }

  console.log('Seeding completed!');
  await app.close();
}

bootstrap();
