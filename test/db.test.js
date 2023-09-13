const db = require('../db');

test('Get raw user data', async () => {
  const data = await db.getUserById(1);
  expect(data).toEqual({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    passwordHash: 'password',
    createdAt: new Date("January 1, 1970 00:00:00 UTC"),
    updatedAt: new Date("January 1, 1971 00:00:00 UTC"),
  });
});