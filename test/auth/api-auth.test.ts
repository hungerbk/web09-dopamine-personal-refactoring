// API 인증 유틸(getUserIdFromHeader/requireUserIdFromHeader) 단위 테스트
// 테스트에서 사용할 요청 생성 헬퍼
import { createMockRequest } from '@test/utils/api-test-helpers';

// authOptions 의존성을 제거하기 위한 모킹
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

describe('api-auth', () => {
  beforeEach(() => {
    // 테스트 간 모킹 상태 초기화
    jest.clearAllMocks();
  });

  it('getUserIdFromHeader는 x-user-id를 반환한다', async () => {
    // 테스트 대상 함수 로드
    const { getUserIdFromHeader } = await import('@/lib/utils/api-auth');

    // x-user-id 헤더가 있는 요청 생성
    const req = createMockRequest(undefined, {
      headers: { 'x-user-id': 'user-1' },
      method: 'GET',
    });

    // 헤더 값이 그대로 반환되는지 확인
    expect(getUserIdFromHeader(req)).toBe('user-1');
  });

  it('getUserIdFromHeader는 없으면 null을 반환한다', async () => {
    // 테스트 대상 함수 로드
    const { getUserIdFromHeader } = await import('@/lib/utils/api-auth');

    // 헤더 없는 요청 생성
    const req = createMockRequest(undefined, { method: 'GET' });

    // 헤더가 없으므로 null 반환 확인
    expect(getUserIdFromHeader(req)).toBeNull();
  });

  it('requireUserIdFromHeader는 헤더가 있으면 userId를 반환한다', async () => {
    const { requireUserIdFromHeader } = await import('@/lib/utils/api-auth');

    const req = createMockRequest(undefined, {
      headers: { 'x-user-id': 'user-1' },
      method: 'GET',
    });

    expect(requireUserIdFromHeader(req)).toBe('user-1');
  });

  it('requireUserIdFromHeader는 헤더가 없으면 throw한다', async () => {
    const { requireUserIdFromHeader } = await import('@/lib/utils/api-auth');

    const req = createMockRequest(undefined, { method: 'GET' });

    // proxy.ts 매처 누락 시 즉시 발견 가능하도록 throw
    expect(() => requireUserIdFromHeader(req)).toThrow(/proxy\.ts matcher misconfigured/);
  });
});
