import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/modules/roles/entities/role.entity';

/**
 * Abstract base class for identity-based accounts (Users and Admins).
 * Provides core authentication fields, 2FA support, and lifecycle hooks for data sanitization.
 */
export abstract class BaseAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  displayName: string;

  @Column({ type: 'varchar', select: false })
  @Exclude()
  password: string;

  // --- Multi-Factor Authentication ---
  @Column({ type: 'boolean', default: false })
  isTwoFactorEnabled: boolean;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  twoFactorSecret: string | null;

  // --- Password Recovery ---
  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  passwordResetCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  passwordResetExpires: Date | null;

  // --- Access Control ---
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  // --- Audit Timestamps ---
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date | null;

  /**
   * Lifecycle hook to normalize data before database persistence.
   * Ensures emails and usernames are stored in a consistent format.
   */
  @BeforeInsert()
  @BeforeUpdate()
  protected sanitizeAccountData(): void {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }

    if (this.username) {
      // Normalizing username to lowercase prevents "User1" and "user1" from being different accounts
      this.username = this.username.toLowerCase().trim();
    }

    if (this.displayName) {
      this.displayName = this.displayName.trim();
    }
  }
}
