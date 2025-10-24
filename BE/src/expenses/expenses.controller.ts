import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid participants or paid by user',
  })
  async create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user._id);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all expenses for a group' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async findAllByGroup(
    @Param('groupId') groupId: string,
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ) {
    const { page = 1, limit = 20 } = paginationDto;
    return this.expensesService.findAll(groupId, req.user._id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user._id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update expense' })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'You can only edit your own expenses or be an admin',
  })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.update(id, updateExpenseDto, req.user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete expense' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'You can only delete your own expenses or be an admin',
  })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.expensesService.remove(id, req.user._id);
    return { message: 'Expense deleted successfully' };
  }

  @Get('group/:groupId/balances')
  @ApiOperation({ summary: 'Get group balances' })
  @ApiResponse({
    status: 200,
    description: 'Group balances retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getGroupBalances(@Param('groupId') groupId: string, @Request() req) {
    return this.expensesService.getGroupBalances(groupId, req.user._id);
  }
}
