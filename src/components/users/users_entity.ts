import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Roles } from '../roles/roles_entity';
import { Tasks } from '../tasks/tasks_entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ length: 50, nullable: true })
  fullname: string;

  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ length: 60, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Tasks, (task) => task.user)
  tasks?: Tasks[];
  @Column({ name: 'role_id' })
  roleId: string;
  @ManyToOne(() => Roles)
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
