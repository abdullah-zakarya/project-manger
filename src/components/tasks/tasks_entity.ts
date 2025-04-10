import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { Users } from '../users/users_entity';
import { Projects } from '../projects/projects_entity';

export enum Status {
  NotStarted = 'Not-Started',
  InProgress = 'In-Progress',
  Completed = 'Completed',
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

@Entity()
export class Tasks {
  @PrimaryGeneratedColumn('uuid', { name: 'task_id' })
  taskId: string;

  @Column({ length: 30, nullable: false, unique: true })
  name: string;

  @Column({ length: 500 })
  description: string;

  @ManyToOne(() => Projects, (project) => project.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Projects;

  @RelationId((task: Tasks) => task.project)
  projectId: string;

  @ManyToOne(() => Users, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @RelationId((task: Tasks) => task.user)
  userId: string;

  @Column({ name: 'estimated_start_time' })
  estimatedStartTime: Date;

  @Column({ name: 'estimated_end_time' })
  estimatedEndTime: Date;

  @Column({ name: 'actual_start_time', nullable: true })
  actualStartTime: Date;

  @Column({ name: 'actual_end_time', nullable: true })
  actualEndTime: Date;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.Low,
  })
  priority: Priority;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.NotStarted,
  })
  status: Status;

  @Column('text', { array: true, default: [], name: 'supported_files' })
  supportedFiles: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
