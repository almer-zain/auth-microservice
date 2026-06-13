import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // e.g., 'users.create', 'posts.delete'

  @Column({ nullable: true })
  description: string;
}

export interface PermissionEntity {
  name: string;
}
