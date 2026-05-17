import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer'; 

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  displayUsername: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Prevents password from being returned in JSON
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
}