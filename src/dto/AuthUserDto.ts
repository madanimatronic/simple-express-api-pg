import { User, UserFromDB } from '@/types/User';

export class AuthUserDto {
  id: UserFromDB['id'];
  email: User['email'];
  isEmailVerified: User['isEmailVerified'];

  constructor(user: UserFromDB) {
    this.id = user.id;
    this.email = user.email;
    this.isEmailVerified = user.is_email_verified;
  }
}
