import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpensesService } from '../expenses/expenses.service';
import { Expense, ExpenseSchema } from '../schemas/expense.schema';
import { Group, GroupSchema } from '../schemas/group.schema';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService, ExpensesService],
  exports: [GroupsService],
})
export class GroupsModule {}
