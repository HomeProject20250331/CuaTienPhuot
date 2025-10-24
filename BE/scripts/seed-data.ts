import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
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

async function seedData() {
  console.log('🌱 Bắt đầu khởi tạo dữ liệu mẫu...');

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
    // Clear existing data
    console.log('🧹 Xóa dữ liệu cũ...');
    await userModel.deleteMany({});
    await groupModel.deleteMany({});
    await expenseModel.deleteMany({});
    await settlementModel.deleteMany({});
    await notificationModel.deleteMany({});
    await paymentFormulaModel.deleteMany({});
    await calculationCacheModel.deleteMany({});

    // 1. Tạo Payment Formulas trước
    console.log('📊 Tạo Payment Formulas...');
    const defaultFormula = new paymentFormulaModel({
      name: 'Chia đều',
      description: 'Chia đều số tiền cho tất cả thành viên',
      formula: 'amount / participants.length',
      isDefault: true,
      isActive: true,
      createdBy: new Types.ObjectId(), // Temporary ID
    });

    const proportionalFormula = new paymentFormulaModel({
      name: 'Chia theo tỷ lệ',
      description: 'Chia theo tỷ lệ phần trăm',
      formula: 'amount * (userWeight / totalWeight)',
      isDefault: false,
      isActive: true,
      createdBy: new Types.ObjectId(), // Temporary ID
    });

    const [savedDefaultFormula, savedProportionalFormula] =
      await paymentFormulaModel.insertMany([
        defaultFormula,
        proportionalFormula,
      ]);

    // 2. Tạo Users
    console.log('👥 Tạo Users...');
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    const users = [
      {
        email: 'admin@ctp.com',
        password: hashedPassword,
        fullName: 'Admin User',
        phone: '0123456789',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'john.doe@ctp.com',
        password: hashedPassword,
        fullName: 'John Doe',
        phone: '0123456780',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'jane.smith@ctp.com',
        password: hashedPassword,
        fullName: 'Jane Smith',
        phone: '0123456781',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'bob.wilson@ctp.com',
        password: hashedPassword,
        fullName: 'Bob Wilson',
        phone: '0123456782',
        isEmailVerified: true,
        isActive: true,
      },
      {
        email: 'alice.brown@ctp.com',
        password: hashedPassword,
        fullName: 'Alice Brown',
        phone: '0123456783',
        isEmailVerified: true,
        isActive: true,
      },
    ];

    const savedUsers = await userModel.insertMany(users);
    console.log(`✅ Đã tạo ${savedUsers.length} users`);

    // 3. Tạo Groups
    console.log('🏠 Tạo Groups...');
    const groups = [
      {
        name: 'Chuyến du lịch Đà Nẵng',
        description: 'Chuyến du lịch 3 ngày 2 đêm tại Đà Nẵng',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        settings: {
          allowMemberAddExpense: true,
          requireApprovalForExpense: false,
          defaultPaymentFormula: savedDefaultFormula._id,
          notificationSettings: {
            newExpense: true,
            newMember: true,
            settlement: true,
            reminder: true,
          },
        },
        members: [
          {
            userId: savedUsers[0]._id,
            role: 'admin',
            joinedAt: new Date(),
            isActive: true,
          },
          {
            userId: savedUsers[1]._id,
            role: 'member',
            joinedAt: new Date(),
            isActive: true,
          },
          {
            userId: savedUsers[2]._id,
            role: 'member',
            joinedAt: new Date(),
            isActive: true,
          },
        ],
        inviteCode: 'DANANG2024',
        inviteCodeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalExpenses: 0,
        totalSettlements: 0,
        createdBy: savedUsers[0]._id,
        isActive: true,
      },
      {
        name: 'Nhóm bạn thân',
        description: 'Nhóm bạn thân từ thời đại học',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        settings: {
          allowMemberAddExpense: true,
          requireApprovalForExpense: false,
          defaultPaymentFormula: savedDefaultFormula._id,
          notificationSettings: {
            newExpense: true,
            newMember: true,
            settlement: true,
            reminder: true,
          },
        },
        members: [
          {
            userId: savedUsers[1]._id,
            role: 'admin',
            joinedAt: new Date(),
            isActive: true,
          },
          {
            userId: savedUsers[2]._id,
            role: 'member',
            joinedAt: new Date(),
            isActive: true,
          },
          {
            userId: savedUsers[3]._id,
            role: 'member',
            joinedAt: new Date(),
            isActive: true,
          },
          {
            userId: savedUsers[4]._id,
            role: 'member',
            joinedAt: new Date(),
            isActive: true,
          },
        ],
        inviteCode: 'FRIENDS2024',
        inviteCodeExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalExpenses: 0,
        totalSettlements: 0,
        createdBy: savedUsers[1]._id,
        isActive: true,
      },
    ];

    const savedGroups = await groupModel.insertMany(groups);
    console.log(`✅ Đã tạo ${savedGroups.length} groups`);

    // 4. Tạo Expenses
    console.log('💰 Tạo Expenses...');
    const expenses = [
      {
        groupId: savedGroups[0]._id,
        title: 'Vé máy bay',
        description: 'Vé máy bay khứ hồi HCM - Đà Nẵng',
        amount: 3000000,
        currency: 'VND',
        category: 'transport',
        splitType: 'equal',
        paidBy: savedUsers[0]._id,
        participants: [
          {
            userId: savedUsers[0]._id,
            amount: 1000000,
            isPaid: true,
            paidAt: new Date(),
            weight: 1,
          },
          {
            userId: savedUsers[1]._id,
            amount: 1000000,
            isPaid: false,
            weight: 1,
          },
          {
            userId: savedUsers[2]._id,
            amount: 1000000,
            isPaid: false,
            weight: 1,
          },
        ],
        receipt: {
          imageUrl: 'https://example.com/receipt1.jpg',
          fileName: 'receipt1.jpg',
          fileSize: 1024000,
          uploadedAt: new Date(),
        },
        tags: ['transport', 'flight'],
        location: {
          name: 'Sân bay Tân Sơn Nhất',
          coordinates: {
            lat: 10.8188,
            lng: 106.6519,
          },
        },
        expenseDate: new Date('2024-01-15'),
        calculationMetadata: {
          totalParticipants: 3,
          baseAmount: 3000000,
          remainder: 0,
          calculationVersion: '1.0',
          lastCalculatedAt: new Date(),
        },
        createdBy: savedUsers[0]._id,
        isActive: true,
      },
      {
        groupId: savedGroups[0]._id,
        title: 'Khách sạn',
        description: 'Phòng khách sạn 2 đêm',
        amount: 2000000,
        currency: 'VND',
        category: 'accommodation',
        splitType: 'equal',
        paidBy: savedUsers[1]._id,
        participants: [
          {
            userId: savedUsers[0]._id,
            amount: 666667,
            isPaid: false,
            weight: 1,
          },
          {
            userId: savedUsers[1]._id,
            amount: 666667,
            isPaid: true,
            paidAt: new Date(),
            weight: 1,
          },
          {
            userId: savedUsers[2]._id,
            amount: 666666,
            isPaid: false,
            weight: 1,
          },
        ],
        tags: ['accommodation', 'hotel'],
        location: {
          name: 'Khách sạn ABC',
          coordinates: {
            lat: 16.0544,
            lng: 108.2022,
          },
        },
        expenseDate: new Date('2024-01-16'),
        calculationMetadata: {
          totalParticipants: 3,
          baseAmount: 2000000,
          remainder: 0,
          calculationVersion: '1.0',
          lastCalculatedAt: new Date(),
        },
        createdBy: savedUsers[1]._id,
        isActive: true,
      },
      {
        groupId: savedGroups[1]._id,
        title: 'Ăn tối nhà hàng',
        description: 'Ăn tối tại nhà hàng hải sản',
        amount: 1500000,
        currency: 'VND',
        category: 'food',
        splitType: 'equal',
        paidBy: savedUsers[2]._id,
        participants: [
          {
            userId: savedUsers[1]._id,
            amount: 375000,
            isPaid: false,
            weight: 1,
          },
          {
            userId: savedUsers[2]._id,
            amount: 375000,
            isPaid: true,
            paidAt: new Date(),
            weight: 1,
          },
          {
            userId: savedUsers[3]._id,
            amount: 375000,
            isPaid: false,
            weight: 1,
          },
          {
            userId: savedUsers[4]._id,
            amount: 375000,
            isPaid: false,
            weight: 1,
          },
        ],
        tags: ['food', 'seafood', 'dinner'],
        location: {
          name: 'Nhà hàng hải sản ABC',
          coordinates: {
            lat: 10.7769,
            lng: 106.7009,
          },
        },
        expenseDate: new Date('2024-01-20'),
        calculationMetadata: {
          totalParticipants: 4,
          baseAmount: 1500000,
          remainder: 0,
          calculationVersion: '1.0',
          lastCalculatedAt: new Date(),
        },
        createdBy: savedUsers[2]._id,
        isActive: true,
      },
    ];

    const savedExpenses = await expenseModel.insertMany(expenses);
    console.log(`✅ Đã tạo ${savedExpenses.length} expenses`);

    // 5. Tạo Settlements
    console.log('💸 Tạo Settlements...');
    const settlements = [
      {
        groupId: savedGroups[0]._id,
        fromUser: savedUsers[1]._id,
        toUser: savedUsers[0]._id,
        amount: 1000000,
        currency: 'VND',
        description: 'Thanh toán tiền vé máy bay',
        status: 'pending',
        paymentMethod: 'bank_transfer',
        paymentReference: 'TXN123456789',
        calculationData: {
          originalDebt: 1000000,
          netAmount: 1000000,
          calculationMethod: 'equal_split',
          relatedExpenses: [savedExpenses[0]._id],
        },
        createdBy: savedUsers[1]._id,
        isActive: true,
      },
      {
        groupId: savedGroups[0]._id,
        fromUser: savedUsers[2]._id,
        toUser: savedUsers[0]._id,
        amount: 1000000,
        currency: 'VND',
        description: 'Thanh toán tiền vé máy bay',
        status: 'completed',
        paymentMethod: 'momo',
        paymentReference: 'MOMO987654321',
        calculationData: {
          originalDebt: 1000000,
          netAmount: 1000000,
          calculationMethod: 'equal_split',
          relatedExpenses: [savedExpenses[0]._id],
        },
        paidAt: new Date(),
        createdBy: savedUsers[2]._id,
        isActive: true,
      },
    ];

    const savedSettlements = await settlementModel.insertMany(settlements);
    console.log(`✅ Đã tạo ${savedSettlements.length} settlements`);

    // 6. Tạo Notifications
    console.log('🔔 Tạo Notifications...');
    const notifications = [
      {
        userId: savedUsers[1]._id,
        groupId: savedGroups[0]._id,
        type: 'new_expense',
        title: 'Chi phí mới được thêm',
        message:
          'Admin User đã thêm chi phí "Vé máy bay" với số tiền 3,000,000 VND',
        data: {
          expenseId: savedExpenses[0]._id,
          amount: 3000000,
          fromUser: savedUsers[0]._id,
          groupName: savedGroups[0].name,
        },
        isRead: false,
        isActive: true,
      },
      {
        userId: savedUsers[2]._id,
        groupId: savedGroups[0]._id,
        type: 'new_expense',
        title: 'Chi phí mới được thêm',
        message:
          'John Doe đã thêm chi phí "Khách sạn" với số tiền 2,000,000 VND',
        data: {
          expenseId: savedExpenses[1]._id,
          amount: 2000000,
          fromUser: savedUsers[1]._id,
          groupName: savedGroups[0].name,
        },
        isRead: false,
        isActive: true,
      },
      {
        userId: savedUsers[1]._id,
        groupId: savedGroups[0]._id,
        type: 'settlement_request',
        title: 'Yêu cầu thanh toán',
        message: 'Bạn cần thanh toán 1,000,000 VND cho Admin User',
        data: {
          settlementId: savedSettlements[0]._id,
          amount: 1000000,
          fromUser: savedUsers[0]._id,
          groupName: savedGroups[0].name,
        },
        isRead: false,
        isActive: true,
      },
      {
        userId: savedUsers[3]._id,
        groupId: savedGroups[1]._id,
        type: 'new_member',
        title: 'Thành viên mới',
        message: 'Alice Brown đã tham gia nhóm "Nhóm bạn thân"',
        data: {
          fromUser: savedUsers[4]._id,
          groupName: savedGroups[1].name,
        },
        isRead: true,
        readAt: new Date(),
        isActive: true,
      },
    ];

    const savedNotifications =
      await notificationModel.insertMany(notifications);
    console.log(`✅ Đã tạo ${savedNotifications.length} notifications`);

    // 7. Tạo Calculation Cache
    console.log('💾 Tạo Calculation Cache...');
    const calculationCaches = [
      {
        groupId: savedGroups[0]._id,
        cacheKey: `settlement_${savedGroups[0]._id}_${Date.now()}`,
        calculationType: 'settlement',
        data: {
          balances: {
            [savedUsers[0]._id.toString()]: 1000000,
            [savedUsers[1]._id.toString()]: -1000000,
            [savedUsers[2]._id.toString()]: 0,
          },
          settlements: [
            {
              from: savedUsers[1]._id.toString(),
              to: savedUsers[0]._id.toString(),
              amount: 1000000,
            },
          ],
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isActive: true,
      },
      {
        groupId: savedGroups[1]._id,
        cacheKey: `balance_${savedGroups[1]._id}_${Date.now()}`,
        calculationType: 'balance',
        data: {
          balances: {
            [savedUsers[1]._id.toString()]: -375000,
            [savedUsers[2]._id.toString()]: 1125000,
            [savedUsers[3]._id.toString()]: -375000,
            [savedUsers[4]._id.toString()]: -375000,
          },
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isActive: true,
      },
    ];

    const savedCalculationCaches =
      await calculationCacheModel.insertMany(calculationCaches);
    console.log(
      `✅ Đã tạo ${savedCalculationCaches.length} calculation caches`,
    );

    // Update PaymentFormula createdBy
    await paymentFormulaModel.updateMany({}, { createdBy: savedUsers[0]._id });

    console.log('🎉 Hoàn thành khởi tạo dữ liệu mẫu!');
    console.log('\n📊 Tổng kết:');
    console.log(`- Users: ${savedUsers.length}`);
    console.log(`- Groups: ${savedGroups.length}`);
    console.log(`- Expenses: ${savedExpenses.length}`);
    console.log(`- Settlements: ${savedSettlements.length}`);
    console.log(`- Notifications: ${savedNotifications.length}`);
    console.log(`- Payment Formulas: 2`);
    console.log(`- Calculation Caches: ${savedCalculationCaches.length}`);

    console.log('\n🔑 Thông tin đăng nhập:');
    console.log('Email: admin@ctp.com | Password: Admin123');
    console.log('Email: john.doe@ctp.com | Password: Admin123');
    console.log('Email: jane.smith@ctp.com | Password: Admin123');
    console.log('Email: bob.wilson@ctp.com | Password: Admin123');
    console.log('Email: alice.brown@ctp.com | Password: Admin123');
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo dữ liệu:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Chạy script
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Script hoàn thành thành công!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script thất bại:', error);
      process.exit(1);
    });
}

export { seedData };
