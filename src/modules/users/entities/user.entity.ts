import { Entity } from 'typeorm';
import { BaseAccount } from 'src/common/entities/base-account.abstract';

@Entity('users')
export class User extends BaseAccount {
  // You can add User-specific fields here later if needed
  // e.g., @Column() stripeCustomerId: string;
}
