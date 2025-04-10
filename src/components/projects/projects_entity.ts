import { Tasks } from '../../components/tasks/tasks_entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn('uuid', { name: 'project_id' })
  projectId: string;

  @Column({ length: 30, nullable: false, unique: true })
  name: string;

  @Column('simple-json', { default: '[]' })
  userIds: string[];

  @Column({ length: 500 })
  description: string;

  @OneToMany(() => Tasks, (task) => task.project)
  tasks: Tasks[];
}
