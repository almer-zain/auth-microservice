// entities/role.entity.ts
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'roles_permissions_permissions' }) // Explicit naming helps prevent DB confusion
  permissions: Permission[];
}

// Used for typing req.user and Auth logic
export interface AccountWithRoles {
  id: number;
  email: string;
  roles: Role[];
}
