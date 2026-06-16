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

  @Column({ type: 'varchar', unique: true, length: 50 })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'roles_permissions_permissions' })
  permissions: Permission[];
}

export interface AccountWithRoles {
  id: number;
  email: string;
  roles: Role[];
}
