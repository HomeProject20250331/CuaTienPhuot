// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the application database
db = db.getSiblingDB('cuatienphuot_dev');

// Create application user with read/write permissions
db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [
    {
      role: 'readWrite',
      db: 'cuatienphuot_dev',
    },
  ],
});

// Create initial collections with indexes
db.createCollection('users');
db.createCollection('groups');
db.createCollection('expenses');
db.createCollection('settlements');
db.createCollection('notifications');

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.groups.createIndex({ name: 1 });
db.groups.createIndex({ createdBy: 1 });
db.groups.createIndex({ createdAt: 1 });

db.expenses.createIndex({ groupId: 1 });
db.expenses.createIndex({ paidBy: 1 });
db.expenses.createIndex({ createdAt: 1 });
db.expenses.createIndex({ amount: 1 });

db.settlements.createIndex({ groupId: 1 });
db.settlements.createIndex({ fromUser: 1 });
db.settlements.createIndex({ toUser: 1 });
db.settlements.createIndex({ status: 1 });

db.notifications.createIndex({ userId: 1 });
db.notifications.createIndex({ type: 1 });
db.notifications.createIndex({ createdAt: 1 });
db.notifications.createIndex({ isRead: 1 });

print('MongoDB initialization completed successfully!');
print('Database: cuatienphuot');
print('User: cuatienphuot_user');
print(
  'Collections created: users, groups, expenses, settlements, notifications',
);
