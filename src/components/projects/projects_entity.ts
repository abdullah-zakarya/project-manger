import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Projects {
  @PrimaryGeneratedColumn("uuid", { name: "project_id" })
  projectId: string;

  @Column({ length: 30, nullable: false, unique: true })
  name: string;

  @Column("simple-array", { default: [] })
  user_ids: string[];

  @Column({ length: 500 })
  description: string;
}
