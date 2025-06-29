import { UserCreationData } from '@/types/User';

export const testUserData = {
  name: 'First user',
  about: 'just a test user',
  points: 10,
};

export const testUsersData: UserCreationData[] = [];

for (let i = 0; i < 3; i++) {
  testUsersData.push({
    name: `User number ${i + 1}`,
    about: 'just a test user',
    points: (i + 1) * 100,
  });
}

export const createdTestUsers = testUsersData.map((user, index) => ({
  id: index + 1,
  ...user,
}));
