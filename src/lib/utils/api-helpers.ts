import { NextResponse } from 'next/server';
import type { ApiError, ApiSuccess } from '@/types';
import { CLIENT_ERROR_MESSAGES } from '@/constants/error-messages';

// 성공 응답 생성
export function createSuccessResponse<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      error: null,
    },
    { status },
  );
}

// 단순 catch 블록용: console.error + createErrorResponse 패턴 통합
export function handleApiError(error: unknown, fallbackCode: string): NextResponse<ApiError> {
  const logMessage = CLIENT_ERROR_MESSAGES[fallbackCode] ?? fallbackCode;
  console.error(logMessage, error);
  return createErrorResponse(fallbackCode, 500);
}

// 에러 응답 생성
// message는 선택적: 동적 메시지가 필요한 경우에만 사용
// message가 없으면 클라이언트에서 CLIENT_ERROR_MESSAGES로 매핑하여 표시
export function createErrorResponse(
  code: string,
  status = 500,
  message?: string,
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: {
        code,
        message: message || code,
      },
    },
    { status },
  );
}
