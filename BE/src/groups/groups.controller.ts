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
import { ExpensesService } from '../expenses/expenses.service';
import { CreateGroupDto } from './dto/create-group.dto';
import {
  AddMemberDto,
  JoinGroupDto,
  UpdateGroupDto,
  UpdateMemberRoleDto,
} from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly expensesService: ExpensesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  async create(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    return this.groupsService.create(createGroupDto, req.user._id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all groups for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
  async findAll(@Query() paginationDto: PaginationDto, @Request() req) {
    const { page = 1, limit = 20 } = paginationDto;
    return this.groupsService.findAll(req.user._id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.groupsService.findOne(id, req.user._id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  @ApiResponse({ status: 403, description: 'Only admins can update group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Request() req,
  ) {
    return this.groupsService.update(id, updateGroupDto, req.user._id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 403, description: 'Only admins can delete group' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.groupsService.remove(id, req.user._id);
    return { message: 'Group deleted successfully' };
  }

  @Get(':id/expenses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get expenses of group' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getExpenses(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ) {
    const { page = 1, limit = 20 } = paginationDto;
    return this.expensesService.findAll(id, req.user._id, page, limit);
  }

  @Get(':id/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get members of group' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully' })
  @ApiResponse({
    status: 403,
    description: 'You are not a member of this group',
  })
  async getMembers(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ) {
    const { page = 1, limit = 20 } = paginationDto;
    return this.groupsService.getMembers(id, req.user._id, page, limit);
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join group with invite code' })
  @ApiResponse({ status: 200, description: 'Successfully joined group' })
  @ApiResponse({ status: 400, description: 'Invalid or expired invite code' })
  @ApiResponse({ status: 409, description: 'Already a member of this group' })
  async joinGroup(@Body() joinGroupDto: JoinGroupDto, @Request() req) {
    return this.groupsService.joinGroup(joinGroupDto, req.user._id);
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave group' })
  @ApiResponse({ status: 200, description: 'Successfully left group' })
  @ApiResponse({ status: 400, description: 'Cannot leave as the only admin' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async leaveGroup(@Param('id') id: string, @Request() req) {
    await this.groupsService.leaveGroup(id, req.user._id);
    return { message: 'Successfully left group' };
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add member to group' })
  @ApiResponse({ status: 200, description: 'Member added successfully' })
  @ApiResponse({ status: 403, description: 'Only admins can add members' })
  @ApiResponse({ status: 409, description: 'User is already a member' })
  async addMember(
    @Param('id') id: string,
    @Body() addMemberDto: AddMemberDto,
    @Request() req,
  ) {
    return this.groupsService.addMember(id, addMemberDto, req.user._id);
  }

  @Delete(':id/members/:memberId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove member from group' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 403, description: 'Only admins can remove members' })
  @ApiResponse({ status: 400, description: 'Cannot remove the last admin' })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req,
  ) {
    await this.groupsService.removeMember(id, memberId, req.user._id);
    return { message: 'Member removed successfully' };
  }

  @Patch(':id/members/:memberId/role')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update member role' })
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only admins can update member roles',
  })
  @ApiResponse({ status: 404, description: 'Member not found' })
  async updateMemberRole(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() updateMemberRoleDto: UpdateMemberRoleDto,
    @Request() req,
  ) {
    await this.groupsService.updateMemberRole(
      id,
      memberId,
      updateMemberRoleDto,
      req.user._id,
    );
    return { message: 'Member role updated successfully' };
  }

  @Post(':id/regenerate-invite-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate invite code' })
  @ApiResponse({
    status: 200,
    description: 'Invite code regenerated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only admins can regenerate invite code',
  })
  async regenerateInviteCode(@Param('id') id: string, @Request() req) {
    return this.groupsService.regenerateInviteCode(id, req.user._id);
  }
}
