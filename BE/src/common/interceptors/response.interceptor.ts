import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedApiResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | PaginatedApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | PaginatedApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // Nếu data đã có format chuẩn, trả về nguyên vẹn
        if (data && typeof data === 'object' && 'success' in data) {
          return {
            ...data,
            timestamp: new Date().toISOString(),
          };
        }

        // Nếu data có pagination (từ service)
        if (data && typeof data === 'object' && 'pagination' in data) {
          const { pagination, ...restData } = data;
          const totalPages = Math.ceil(pagination.total / pagination.limit);

          return {
            success: true,
            data: restData.data || [],
            pagination: {
              page: pagination.page || 1,
              limit: pagination.limit || 10,
              total: pagination.total || 0,
              totalPages,
              hasNext: pagination.page < totalPages,
              hasPrev: pagination.page > 1,
            },
            timestamp: new Date().toISOString(),
          };
        }

        // Nếu data chỉ là message string
        if (typeof data === 'string') {
          return {
            success: true,
            message: data,
            timestamp: new Date().toISOString(),
          };
        }

        // Nếu data là object với message
        if (data && typeof data === 'object' && 'message' in data) {
          return {
            success: true,
            message: data.message,
            timestamp: new Date().toISOString(),
          };
        }

        // Format chuẩn cho data
        return {
          success: true,
          data: data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
