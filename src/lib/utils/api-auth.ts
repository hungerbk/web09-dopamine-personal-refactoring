import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getUserIdFromServer } from './cookie';

// proxy.ts(미들웨어)가 인증된 요청에 주입한 x-user-id 헤더를 읽음
export function getUserIdFromHeader(request: Request | NextRequest): string | null {
  return request.headers.get('x-user-id') || null;
}

// 인증 필수 라우트용.
// createErrorResponse 대신 throw를 사용하는 이유:
//   이 함수는 string을 반환하는 유틸이므로 NextResponse를 반환할 수 없고,
//   헤더 누락은 사용자 에러가 아니라 proxy.ts matcher 설정 누락(개발자 실수)이다.
//   정상 운영 중에는 이 분기가 절대 실행되지 않아야 하므로 500으로 즉시 터뜨려 발견하게 한다.
export function requireUserIdFromHeader(request: Request | NextRequest): string {
  const userId = getUserIdFromHeader(request);
  if (!userId) {
    const url = 'nextUrl' in request ? request.nextUrl.pathname : request.url;
    throw new Error(`Missing x-user-id header — proxy.ts matcher misconfigured (path: ${url})`);
  }
  return userId;
}

export async function getIssueUserId(issueId: string): Promise<string | null> {
  // 1. 쿠키에서 먼저 찾기 (비회원 최우선)
  const cookieUserId = await getUserIdFromServer(issueId);
  if (cookieUserId) return cookieUserId;

  // 2. 쿠키에 없으면 세션에서 찾기 (로그인 유저)
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}
