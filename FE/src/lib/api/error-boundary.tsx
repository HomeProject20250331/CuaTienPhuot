/**
 * Error Boundary cho React Query
 * Xử lý lỗi toàn cục cho ứng dụng
 */

"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Đã xảy ra lỗi
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          {process.env.NODE_ENV === "development"
            ? error.message
            : "Có lỗi xảy ra trong quá trình tải dữ liệu. Vui lòng thử lại."}
        </p>

        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Thử lại
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Về trang chủ
          </button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-4">
            <summary className="text-xs text-gray-500 cursor-pointer">
              Chi tiết lỗi (Development)
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={reset}
          onError={(error: Error, errorInfo: React.ErrorInfo) => {
            // Log error to console in development
            if (process.env.NODE_ENV === "development") {
              console.error(
                "Error Boundary caught an error:",
                error,
                errorInfo
              );
            }

            // Here you can add error reporting service integration
            // Example: Sentry.captureException(error);
          }}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
