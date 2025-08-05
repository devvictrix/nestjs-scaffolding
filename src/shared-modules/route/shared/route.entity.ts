import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ROUTE_ACCESS_TYPES, ROUTE_STATUSES } from './route.constant';

@Entity('routes')
export class Route {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column({ nullable: true })
  description: string | null;

  @Column({
    name: 'access_type',
    type: 'enum',
    enum: ROUTE_ACCESS_TYPES,
    default: ROUTE_ACCESS_TYPES.PRIVATE,
  })
  accessType: ROUTE_ACCESS_TYPES;

  @Column({
    type: 'enum',
    enum: ROUTE_STATUSES,
    default: ROUTE_STATUSES.DEACTIVATED,
  })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
}
