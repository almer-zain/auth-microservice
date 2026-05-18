import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { BaseAccount } from 'src/common/entities/base-account.abstract';

@Entity('admin')
export class Admin extends BaseAccount {
  // You can add User-specific fields here later if needed
  // e.g., @Column() stripeCustomerId: string;
}