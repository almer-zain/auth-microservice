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

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  displayName: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  // --- Multi-Factor Authentication ---
  @Column({ default: false })
  isTwoFactorEnabled: boolean;

  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string | null;

  // --- Password Recovery ---
  @Column({ nullable: true })
  @Exclude()
  passwordResetCode: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  passwordResetExpires: Date | null;

  // --- Access Control ---
  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  // --- Audit Timestamps ---
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

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
