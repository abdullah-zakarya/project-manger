import { resolveSoa } from "dns";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  RoleSpecification,
} from "typeorm";
import { Roles } from "../roles/roles_entity";

Entity();
export class Users {
  @PrimaryGeneratedColumn("uuid", { name: "user_id" })
  userId: string;

  @Column({ length: 50, nullable: true })
  fullname: string;

  @Column({ length: 30, nullable: false, unique: true })
  username: string;

  @Column({ length: 60, nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  @ManyToOne(() => resolveSoa)
  @JoinColumn({ name: "role_id" })
  role_id: Roles["roleId"];
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
