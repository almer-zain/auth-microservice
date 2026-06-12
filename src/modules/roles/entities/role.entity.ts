import {
  Permission,
  PermissionEntity,
} from 'src/modules/permissions/entities/permission.entity';
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
  name: string; // e.g., 'super-admin', 'editor', 'customer'

  @ManyToMany(() => Permission, { eager: true })
  @JoinTable()
  permissions: Permission[];
}

export interface RoleEntity {
  permissions: PermissionEntity[];
}

export interface AccountWithRoles {
  id: number;
  email: string;
  roles?: RoleEntity[];
}
