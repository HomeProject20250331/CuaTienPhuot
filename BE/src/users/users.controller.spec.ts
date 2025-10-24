import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile with success response', async () => {
      const mockUser = {
        _id: 'user_id',
        email: 'test@example.com',
        fullName: 'Test User',
        phone: '+84901234567',
        avatar: 'https://example.com/avatar.jpg',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
        preferences: {
          language: 'vi',
          timezone: 'Asia/Ho_Chi_Minh',
          currency: 'VND',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
        },
      };

      jest.spyOn(service, 'getProfile').mockResolvedValue(mockUser as any);

      const mockRequest = { user: { _id: 'user_id' } };
      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual({
        success: true,
        data: mockUser,
      });
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateProfileDto = {
        fullName: 'Updated Name',
        phone: '+84901234568',
        preferences: {
          language: 'en' as const,
          currency: 'USD' as const,
          notifications: {
            email: false,
            push: true,
          },
        },
      };

      const updatedUser = {
        _id: 'user_id',
        email: 'test@example.com',
        fullName: 'Updated Name',
        phone: '+84901234568',
        preferences: {
          language: 'en',
          timezone: 'Asia/Ho_Chi_Minh',
          currency: 'USD',
          notifications: {
            email: false,
            push: true,
            sms: false,
          },
        },
      };

      jest
        .spyOn(service, 'updateProfile')
        .mockResolvedValue(updatedUser as any);

      const mockRequest = { user: { _id: 'user_id' } };
      const result = await controller.updateProfile(
        mockRequest,
        updateProfileDto,
      );

      expect(result).toEqual({
        success: true,
        data: updatedUser,
        message: 'Profile đã được cập nhật',
      });
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      };

      jest.spyOn(service, 'changePassword').mockResolvedValue(undefined);

      const mockRequest = { user: { _id: 'user_id' } };
      const result = await controller.changePassword(
        mockRequest,
        changePasswordDto,
      );

      expect(result).toEqual({
        success: true,
        message: 'Mật khẩu đã được thay đổi thành công',
      });
    });
  });
});
