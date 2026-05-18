import { User } from "src/modules/users/entities/user.entity";
import { Admin } from "src/modules/admins/entities/admin.entity";
  import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------
// JWT
// ----------------------------------------------------------------

interface AuthAccount {
  id: number;
  email: string;
  roles: any[]; // Adjust to your Role entity type
}

export async function generateToken(account: User | Admin) {
  // Cast to AuthAccount so TS allows access to .email and .roles
  const authAccount = account as unknown as AuthAccount;

  // Flatten permissions
  const permissions = authAccount.roles
    ? authAccount.roles
        .flatMap((role) => role.permissions)
        .map((p) => p.name)
    : [];


  const payload = { 
    sub: account.id, 
    email: account.email,
    type: checkAdminOrUser, // 'admin' or 'user'
    permissions: Array.from(new Set(permissions)), // Unique permission slugs
  };

  return this.jwtService.sign(payload);
}

async function checkAdminOrUser(account: User | Admin) {
  return (account instanceof Admin) ? "admin" : "user"
}