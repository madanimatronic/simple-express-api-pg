import { RoleName } from '@/types/role';
import { User, UserFromDB } from '@/types/User';

export class AuthUserDto {
  id: UserFromDB['id'];
  email: User['email'];
  isEmailVerified: User['isEmailVerified'];
  roles: RoleName[];

  constructor(user: UserFromDB, roles: RoleName[]) {
    this.id = user.id;
    this.email = user.email;
    this.isEmailVerified = user.is_email_verified;
    this.roles = roles;
  }
}
