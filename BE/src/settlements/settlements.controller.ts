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
import { CreateSettlementDto } from './dto/create-settlement.dto';
import { UpdateSettlementDto } from './dto/update-settlement.dto';
import { SettlementsService } from './settlements.service';

@ApiTags('Settlements')
@Controller('settlements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SettlementsController {
  constructor(private readonly settlementsService: SettlementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new settlement' })
  @ApiResponse({ status: 201, description: 'Settlement created successfully' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  @ApiResponse({ status: 400, description: 'Invalid users or same user' })
  async create(
    @Body() createSettlementDto: CreateSettlementDto,
    @Request() req,
  ) {
    return this.settlementsService.create(createSettlementDto, req.user._id);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Get all settlements for a group' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Settlements retrieved successfully',
  })
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
    return this.settlementsService.findAll(groupId, req.user._id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get settlement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Settlement retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Settlement not found' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.settlementsService.findOne(id, req.user._id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update settlement' })
  @ApiResponse({ status: 200, description: 'Settlement updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'You can only edit your own settlements or be an admin',
  })
  @ApiResponse({ status: 404, description: 'Settlement not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSettlementDto: UpdateSettlementDto,
    @Request() req,
  ) {
    return this.settlementsService.update(
      id,
      updateSettlementDto,
      req.user._id,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete settlement' })
  @ApiResponse({ status: 200, description: 'Settlement deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'You can only delete your own settlements or be an admin',
  })
  @ApiResponse({ status: 404, description: 'Settlement not found' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.settlementsService.remove(id, req.user._id);
    return { message: 'Settlement deleted successfully' };
  }

  @Get('group/:groupId/summary')
  @ApiOperation({ summary: 'Get settlement summary for a group' })
  @ApiResponse({
    status: 200,
    description: 'Settlement summary retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getSettlementSummary(
    @Param('groupId') groupId: string,
    @Request() req,
  ) {
    return this.settlementsService.getSettlementSummary(groupId, req.user._id);
  }
}
