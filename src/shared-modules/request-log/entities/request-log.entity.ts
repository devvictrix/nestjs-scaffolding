import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('request_logs')
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column({ name: 'status_code', nullable: true })
  statusCode: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  duration: string | null;

  @Column({ type: 'text', nullable: true })
  header: string | null;

  @Column({ length: 2500, nullable: true })
  query: string | null;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'text', nullable: true })
  response: string | null;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ nullable: true })
  referer: string | null;

  @Column({ name: 'user_agent' })
  userAgent: string;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'text', nullable: true })
  stack: string | null;

  @Column({ name: 'user_id', nullable: true })
  userId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
