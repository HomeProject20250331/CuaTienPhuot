import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../src/app.module';

// Import schemas
import {
  CalculationCache,
  CalculationCacheDocument,
} from '../src/schemas/calculation-cache.schema';
import { Expense, ExpenseDocument } from '../src/schemas/expense.schema';
import { Group, GroupDocument } from '../src/schemas/group.schema';
import {
  Notification,
  NotificationDocument,
} from '../src/schemas/notification.schema';
import {
  PaymentFormula,
  PaymentFormulaDocument,
} from '../src/schemas/payment-formula.schema';
import {
  Settlement,
  SettlementDocument,
} from '../src/schemas/settlement.schema';
import { User, UserDocument } from '../src/schemas/user.schema';

async function testSeedData() {
  console.log('🔍 Kiểm tra dữ liệu seed...');

  const app = await NestFactory.createApplicationContext(AppModule);

  // Get models
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const groupModel = app.get<Model<GroupDocument>>(getModelToken(Group.name));
  const expenseModel = app.get<Model<ExpenseDocument>>(
    getModelToken(Expense.name),
  );
  const settlementModel = app.get<Model<SettlementDocument>>(
    getModelToken(Settlement.name),
  );
  const notificationModel = app.get<Model<NotificationDocument>>(
    getModelToken(Notification.name),
  );
  const paymentFormulaModel = app.get<Model<PaymentFormulaDocument>>(
    getModelToken(PaymentFormula.name),
  );
  const calculationCacheModel = app.get<Model<CalculationCacheDocument>>(
    getModelToken(CalculationCache.name),
  );

  try {
    // Đếm số lượng records
    const userCount = await userModel.countDocuments();
    const groupCount = await groupModel.countDocuments();
    const expenseCount = await expenseModel.countDocuments();
    const settlementCount = await settlementModel.countDocuments();
    const notificationCount = await notificationModel.countDocuments();
    const paymentFormulaCount = await paymentFormulaModel.countDocuments();
    const calculationCacheCount = await calculationCacheModel.countDocuments();

    console.log('\n📊 Kết quả kiểm tra:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏠 Groups: ${groupCount}`);
    console.log(`💰 Expenses: ${expenseCount}`);
    console.log(`💸 Settlements: ${settlementCount}`);
    console.log(`🔔 Notifications: ${notificationCount}`);
    console.log(`📊 Payment Formulas: ${paymentFormulaCount}`);
    console.log(`💾 Calculation Caches: ${calculationCacheCount}`);

    // Kiểm tra dữ liệu chi tiết
    if (userCount > 0) {
      console.log('\n👥 Sample Users:');
      const users = await userModel.find({}, 'email fullName').limit(3);
      users.forEach((user) => {
        console.log(`   - ${user.email} (${user.fullName})`);
      });
    }

    if (groupCount > 0) {
      console.log('\n🏠 Sample Groups:');
      const groups = await groupModel
        .find({}, 'name description members')
        .limit(2);
      groups.forEach((group) => {
        console.log(`   - ${group.name}: ${group.members.length} members`);
      });
    }

    if (expenseCount > 0) {
      console.log('\n💰 Sample Expenses:');
      const expenses = await expenseModel
        .find({}, 'title amount currency category')
        .limit(3);
      expenses.forEach((expense) => {
        console.log(
          `   - ${expense.title}: ${expense.amount.toLocaleString()} ${expense.currency} (${expense.category})`,
        );
      });
    }

    // Kiểm tra relationships
    console.log('\n🔗 Kiểm tra relationships:');

    // Kiểm tra users trong groups
    const groupsWithMembers = await groupModel.aggregate([
      { $unwind: '$members' },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          memberCount: { $sum: 1 },
        },
      },
      { $limit: 2 },
    ]);

    if (groupsWithMembers.length > 0) {
      console.log('   ✅ Groups có members');
      groupsWithMembers.forEach((group) => {
        console.log(`      - ${group.name}: ${group.memberCount} members`);
      });
    }

    // Kiểm tra expenses trong groups
    const expensesInGroups = await expenseModel.aggregate([
      { $group: { _id: '$groupId', expenseCount: { $sum: 1 } } },
      { $limit: 2 },
    ]);

    if (expensesInGroups.length > 0) {
      console.log('   ✅ Expenses được gán cho groups');
      expensesInGroups.forEach((expense) => {
        console.log(
          `      - Group ${expense._id}: ${expense.expenseCount} expenses`,
        );
      });
    }

    // Kiểm tra notifications cho users
    const notificationsForUsers = await notificationModel.aggregate([
      { $group: { _id: '$userId', notificationCount: { $sum: 1 } } },
      { $limit: 3 },
    ]);

    if (notificationsForUsers.length > 0) {
      console.log('   ✅ Notifications được gán cho users');
      notificationsForUsers.forEach((notif) => {
        console.log(
          `      - User ${notif._id}: ${notif.notificationCount} notifications`,
        );
      });
    }

    // Tổng kết
    const totalRecords =
      userCount +
      groupCount +
      expenseCount +
      settlementCount +
      notificationCount +
      paymentFormulaCount +
      calculationCacheCount;

    console.log(`\n🎯 Tổng kết:`);
    console.log(`   📈 Tổng số records: ${totalRecords}`);

    if (totalRecords > 0) {
      console.log('   ✅ Seed data đã được tạo thành công!');
      console.log('   🚀 Bạn có thể bắt đầu sử dụng ứng dụng với dữ liệu mẫu.');
    } else {
      console.log('   ❌ Không có dữ liệu nào được tìm thấy.');
      console.log('   💡 Hãy chạy script seed trước: npm run seed');
    }
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra dữ liệu:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Chạy script
if (require.main === module) {
  testSeedData()
    .then(() => {
      console.log('✅ Script kiểm tra hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script kiểm tra thất bại:', error);
      process.exit(1);
    });
}

export { testSeedData };
