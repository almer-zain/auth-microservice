import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 100 })
  name: string; // e.g., 'users.create'

  @Column({ type: 'text', nullable: true })
  description: string | null;
}

export interface PermissionEntity {
  name: string;
}
