import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientName: string;

  @Column({ nullable: true })
  patientEmail: string;

  @Column({ nullable: true })
  patientPhone: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: 'scheduled' })
  status: string; // scheduled, completed, cancelled

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  @JoinColumn()
  doctor: Doctor;

  @Column()
  doctorId: number;
}
