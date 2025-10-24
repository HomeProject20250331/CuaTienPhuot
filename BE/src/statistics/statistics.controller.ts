import {
  Controller,
  Get,
  Param,
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
import { StatisticsQueryDto } from './dto/statistics-query.dto';
import { StatisticsService } from './statistics.service';

@ApiTags('Statistics')
@Controller('statistics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get group statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Group statistics retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getGroupStatistics(
    @Param('groupId') groupId: string,
    @Query() query: StatisticsQueryDto,
    @Request() req,
  ) {
    return this.statisticsService.getGroupStatistics(
      groupId,
      req.user._id,
      query,
    );
  }

  @Get('user')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserStatistics(@Query() query: StatisticsQueryDto, @Request() req) {
    return this.statisticsService.getUserStatistics(req.user._id, query);
  }

  @Get('group/:groupId/trends')
  @ApiOperation({ summary: 'Get expense trends for a group' })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['day', 'week', 'month', 'year'],
  })
  @ApiResponse({
    status: 200,
    description: 'Expense trends retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getExpenseTrends(
    @Param('groupId') groupId: string,
    @Query('period') period: string,
    @Request() req,
  ) {
    return this.statisticsService.getExpenseTrends(
      groupId,
      req.user._id,
      period,
    );
  }

  @Get('group/:groupId/top-spenders')
  @ApiOperation({ summary: 'Get top spenders in a group' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Top spenders retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getTopSpenders(
    @Param('groupId') groupId: string,
    @Query('limit') limit: number,
    @Request() req,
  ) {
    return this.statisticsService.getTopSpenders(groupId, req.user._id, limit);
  }

  @Get('group/:groupId/category-breakdown')
  @ApiOperation({ summary: 'Get category breakdown for a group' })
  @ApiResponse({
    status: 200,
    description: 'Category breakdown retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getCategoryBreakdown(
    @Param('groupId') groupId: string,
    @Request() req,
  ) {
    return this.statisticsService.getCategoryBreakdown(groupId, req.user._id);
  }
}
