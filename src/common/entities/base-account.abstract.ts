import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/modules/roles/entities/role.entity';

export abstract class BaseAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  displayName: string;

  @Column({ select: false })
  @Exclude() // Hides from JSON
  password: string;

  // --- 2FA Fields ---
  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string | null;

  // --- Password Reset Fields ---
  @Column({ nullable: true })
  @Exclude()
  passwordResetCode: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetExpires: Date | null;

  // --- Relations ---
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  // --- Timestamps & Soft Delete ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude() // Usually, we don't want to expose deletedAt dates to the frontend
  deletedAt: Date;
}