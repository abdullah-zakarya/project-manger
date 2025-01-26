import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "../users/users_entity";
import { Tasks } from "../tasks/tasks_entity";

@Entity()
export class Comments {
  @PrimaryGeneratedColumn("uuid", { name: "comment_id" })
  commentId: string;
  @Column({ type: "text" })
  comment: string;
  @OneToOne(() => Users, (userData) => userData.userId)
  @JoinColumn({ name: "user_id" })
  user_id: string;
  @OneToOne(() => Tasks, (taskData) => taskData.taskId)
  @JoinColumn({ name: "task_id" })
  taskId: string;
  @Column("text", { array: true, default: [] })
  supported_files: string[];
  @CreateDateColumn({ name: "created_at" })
  createdA: Date;
  @UpdateDateColumn("updated_at")
  updatedAt: Date;
}
