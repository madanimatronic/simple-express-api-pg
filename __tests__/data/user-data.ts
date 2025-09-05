import { PublicUserDto } from '@/dto/PublicUserDto';
import { UserCreationData, UserFromDB } from '@/types/User';

export const hashedPassword =
  '$2b$06$uCZOPzvLtaxnKjHzRQ9xjux2XqHIUc3o0hkd7n.PyJ1xoFt3wJJFq';

export const testUserCreationData: UserCreationData = {
  name: `first user`,
  email: 'teStmAilB3_201@test.com',
  password: 'abcd1234',
  about: 'just a test user',
};

export const createdTestUserFromDB: UserFromDB = {
  ...testUserCreationData,
  id: 1,
  is_email_verified: false,
  password: hashedPassword,
  about: testUserCreationData.about ?? null,
  points: 0,
};

export const testUsersCreationData: UserCreationData[] = [];

for (let i = 0; i < 3; i++) {
  testUsersCreationData.push({
    name: `User number ${i + 1}`,
    email: `teStmAilB3_201_${i + 1}@test.com`,
    password: 'abcd1234',
    about: `just a test user ${i + 1}`,
  });
}

// Не забыть мокнуть bcrypt.hash
export const createdTestUsersFromDB: UserFromDB[] = testUsersCreationData.map(
  (user, index) => ({
    ...user,
    id: index + 1,
    is_email_verified: false,
    points: 0,
    about: user.about ?? null,
    password: hashedPassword,
  }),
);

export const createdTestUsersPublicData = createdTestUsersFromDB.map(
  (userFromDB) => {
    const publicUserDto = new PublicUserDto(userFromDB);
    return { ...publicUserDto };
  },
);
