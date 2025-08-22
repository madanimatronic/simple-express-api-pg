import { User, UserFromDB } from '@/types/User';

export class PublicUserDto {
  name: User['name'];
  about: User['about'];
  points: User['points'];

  constructor(user: UserFromDB) {
    this.name = user.name;
    this.about = user.about;
    this.points = user.points;
  }
}
