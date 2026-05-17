import { User } from "src/modules/users/entities/user.entity";

// ----------------------------------------------------------------
// JWT
// ----------------------------------------------------------------
export function generateToken(user: User) {
  return {
    access_token: this.jwtService.sign({
      sub: user.id,
      email: user.email,
    }),
  };
}