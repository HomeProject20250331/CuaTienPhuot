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
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto, UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    return this.usersService.findAll(page, limit);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Request() req) {
    const user = await this.usersService.getProfile(req.user._id);
    return {
      success: true,
      data: user,
      message: 'Profile retrieved successfully',
    };
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 409,
    description: 'Số điện thoại đã được sử dụng bởi user khác',
  })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(
      req.user._id,
      updateProfileDto,
    );
    return {
      success: true,
      data: user,
      message: 'Profile đã được cập nhật',
    };
  }

  @Put('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Mật khẩu đã được thay đổi thành công',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc mật khẩu hiện tại không chính xác',
  })
  @ApiResponse({
    status: 422,
    description: 'Mật khẩu mới không đủ mạnh hoặc trùng với mật khẩu cũ',
  })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user._id, changePasswordDto);
    return {
      success: true,
      message: 'Mật khẩu đã được thay đổi thành công',
    };
  }

  @Put('me/avatar')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Avatar đã được cập nhật' })
  @ApiResponse({ status: 400, description: 'File không hợp lệ hoặc quá lớn' })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  })
  @ApiResponse({ status: 413, description: 'File quá lớn (>5MB)' })
  @ApiResponse({ status: 415, description: 'Định dạng file không được hỗ trợ' })
  async updateAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // TODO: Implement file upload logic with validation
    // For now, return mock response
    const avatarUrl = `https://example.com/avatars/${req.user._id}_${Date.now()}.jpg`;
    const avatarThumbnailUrl = `https://example.com/avatars/thumb_${req.user._id}_${Date.now()}.jpg`;

    const user = await this.usersService.updateAvatar(
      req.user._id,
      avatarUrl,
      avatarThumbnailUrl,
    );
    return {
      success: true,
      data: {
        avatar: user.avatar,
        avatarThumbnail: user.avatarThumbnail,
      },
      message: 'Avatar đã được cập nhật',
    };
  }

  @Delete('me/avatar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar đã được xóa' })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  })
  async removeAvatar(@Request() req) {
    const user = await this.usersService.removeAvatar(req.user._id);
    return {
      success: true,
      data: {
        avatar: user.avatar,
        avatarThumbnail: user.avatarThumbnail,
      },
      message: 'Avatar đã được xóa',
    };
  }

  @Get('me/groups')
  @ApiOperation({ summary: 'Get user groups' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'archived'] })
  @ApiQuery({ name: 'role', required: false, enum: ['admin', 'member'] })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  })
  async getUserGroups(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('status') status?: string,
    @Query('role') role?: string,
  ) {
    const result = await this.usersService.getUserGroups(
      req.user._id,
      page,
      limit,
      status,
      role,
    );
    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
    };
  }

  @Get('me/notifications')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['expense', 'settlement', 'group', 'system'],
  })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Token không hợp lệ hoặc đã hết hạn',
  })
  async getUserNotifications(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('type') type?: string,
    @Query('isRead') isRead?: boolean,
  ) {
    const result = await this.usersService.getUserNotifications(
      req.user._id,
      page,
      limit,
      type,
      isRead,
    );
    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
      unreadCount: result.unreadCount,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update current user profile (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async updateProfileLegacy(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user._id, updateUserDto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password (legacy endpoint)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePasswordLegacy(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user._id, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
