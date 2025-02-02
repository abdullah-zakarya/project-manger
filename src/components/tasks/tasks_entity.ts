import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Users } from "../users/users_entity";
import { Projects } from "../projects/projects_entity";
export enum Status {
  NotStarted = "Not-Started",
  InProgress = "In-Progress",
  Completed = "Completed",
}
export enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}
@Entity()
export class Tasks {
  @PrimaryGeneratedColumn("uuid", { name: "task_id" })
  taskId: string;

  @Column({ length: 30, nullable: false, unique: true })
  name: string;

  @Column({ length: 500 })
  description: string;

  @Column({ name: "project_id" })
  @ManyToOne(() => Projects, (projectData) => projectData.projectId)
  @JoinColumn({ name: "project_id" })
  projectId: string;

  @Column({ name: "user_id" })
  @ManyToOne(() => Users, (userData) => userData.userId)
  @JoinColumn({ name: "user_id" })
  userId: string;

  @Column({ name: "estimated_start_time" })
  estimatedStartTime: Date;

  @Column({ name: "estimated_end_time" })
  estimatedEndTime: Date;

  @Column({ name: "actual_start_time" })
  actualStartTime: Date;

  @Column({ name: "actual_end_time" })
  actualEndTime: Date;

  @Column({
    type: "enum",
    enum: Priority, // Use the enum type here
    default: Priority.Low, // Set a default value as Low
  })
  priority: Priority;

  @Column({
    type: "enum",
    enum: Status, // Use the enum type here
    default: Status.NotStarted, // Set a default value as NotStarted
  })
  status: Status;

  @Column("text", { array: true, default: [], name: "supported_files" })
  supportedFiles: string[];

  @CreateDateColumn({ name: "createdAT" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updatedAT" })
  updatedAt: Date;
}
