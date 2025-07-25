import { User, UserFromDB } from '@/types/User';

export class FullUserDto {
  email: User['email'];
  password: User['password'];
  isEmailVerified: User['isEmailVerified'];
  name: User['name'];
  about: User['about'];
  points: User['points'];

  constructor(user: UserFromDB) {
    this.email = user.email;
    this.password = user.password;
    this.isEmailVerified = user.is_email_verified;
    this.name = user.name;
    this.about = user.about;
    this.points = user.points;
  }
}
