const db = require('../db');
const { beforeFindAfterExpandIncludeAll } = require('../models/user');

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

test('Get all entries of a user', async () => {
  const data = await db.getAllEntriesOfUser(1);
  expect(data).toEqual([
    {
      id: 1,
      userId: 1,
      title: 'test entry',
      content: 'test content',
      tags: 'test, entry',
      createdAt: new Date("January 1, 1970 00:00:00 UTC"),
      updatedAt: new Date("January 1, 1971 00:00:00 UTC"),
    },
    {
      id: 2,
      userId: 1,
      title: 'test entry 2',
      content: 'test content 2',
      tags: 'test, entry, 2',
      createdAt: new Date("January 1, 1970 00:00:00 UTC"),
      updatedAt: new Date("January 1, 1971 00:00:00 UTC"),
    }
  ]);
});

test('Create and retrieve a reminder', async () => {

  const create = await db.createReminder({
    entryId: 1,
    reminderTime: new Date("January 1, 1975 00:00:00 UTC")
  });

  expect(create.entryId).toBe(1);
  expect(create.reminderTime).toEqual(new Date("January 1, 1975 00:00:00 UTC"));


  const get = await db.getReminderById(create.id);
  
  expect(get.reminderTime).toEqual(new Date("January 1, 1975 00:00:00 UTC"));
  expect(get.isCompleted).toEqual(false);
});