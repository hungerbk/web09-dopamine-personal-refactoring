import {
  createMockRequest,
  expectErrorResponse,
  expectSuccessResponse,
} from '@test/utils/api-test-helpers';
import { POST } from '@/app/api/topics/route';
import * as topicRepository from '@/lib/repositories/topic.repository';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';

jest.mock('@/lib/utils/api-auth');
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));
jest.mock('@/lib/repositories/topic.repository');

const mockedRequireUserIdFromHeader = requireUserIdFromHeader as jest.MockedFunction<
  typeof requireUserIdFromHeader
>;
const mockedCreateTopic = topicRepository.createTopic as jest.MockedFunction<
  typeof topicRepository.createTopic
>;

describe('POST /api/topics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('헤더가 없으면 throw한다', async () => {
    mockedRequireUserIdFromHeader.mockImplementation(() => {
      throw new Error('Missing x-user-id header');
    });

    const req = createMockRequest({ title: 'New Topic', projectId: 'project-1' });
    await expect(POST(req)).rejects.toThrow();
  });

  it('title이 없으면 400 에러를 반환한다', async () => {
    mockedRequireUserIdFromHeader.mockReturnValue('user-1');

    const req = createMockRequest({ projectId: 'project-1' });
    const response = await POST(req);
    await expectErrorResponse(response, 400, 'TITLE_REQUIRED');
  });

  it('projectId가 없으면 400 에러를 반환한다', async () => {
    mockedRequireUserIdFromHeader.mockReturnValue('user-1');

    const req = createMockRequest({ title: 'New Topic' });
    const response = await POST(req);
    await expectErrorResponse(response, 400, 'PROJECT_ID_REQUIRED');
  });

  it('성공적으로 토픽을 생성한다', async () => {
    const mockTopic = { id: 'topic-1', title: 'New Topic', projectId: 'project-1' };

    mockedRequireUserIdFromHeader.mockReturnValue('user-1');
    mockedCreateTopic.mockResolvedValue(mockTopic as any);

    const req = createMockRequest({ title: 'New Topic', projectId: 'project-1' });
    const response = await POST(req);
    const data = await expectSuccessResponse(response, 201);

    expect(data.id).toBe('topic-1');
    expect(data.title).toBe('New Topic');
    expect(data.projectId).toBe('project-1');
    expect(mockedCreateTopic).toHaveBeenCalledWith('New Topic', 'project-1');
  });

  it('에러 발생 시 500 에러를 반환한다', async () => {
    mockedRequireUserIdFromHeader.mockReturnValue('user-1');
    mockedCreateTopic.mockRejectedValue(new Error('Database error'));

    const req = createMockRequest({ title: 'New Topic', projectId: 'project-1' });
    const response = await POST(req);
    await expectErrorResponse(response, 500, 'TOPIC_CREATE_FAILED');
  });
});
