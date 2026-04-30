import { GET, PATCH } from '@/app/api/projects/[projectId]/route';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';
import * as projectRepository from '@/lib/repositories/project.repository';
import {
  createMockGetRequest,
  createMockParams,
  createMockRequest,
  expectErrorResponse,
  expectSuccessResponse,
} from '@test/utils/api-test-helpers';

jest.mock('@/lib/utils/api-auth');
jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));
jest.mock('@/lib/repositories/project.repository');

const mockedRequireUserIdFromHeader = requireUserIdFromHeader as jest.MockedFunction<
  typeof requireUserIdFromHeader
>;
const mockedGetProjectWithTopics = projectRepository.getProjectWithTopics as jest.MockedFunction<
  typeof projectRepository.getProjectWithTopics
>;
const mockedUpdateProject = projectRepository.updateProject as jest.MockedFunction<
  typeof projectRepository.updateProject
>;

describe('GET /api/projects/[projectId]', () => {
  const projectId = 'project-1';
  const userId = 'user-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('헤더가 없으면 throw한다', async () => {
    mockedRequireUserIdFromHeader.mockImplementation(() => {
      throw new Error('Missing x-user-id header');
    });

    const req = createMockGetRequest();
    const params = createMockParams({ projectId });

    await expect(GET(req, params)).rejects.toThrow();
  });

  it('성공적으로 프로젝트를 조회한다', async () => {
    const mockProject = { id: projectId, title: 'Test Project', topics: [] };

    mockedRequireUserIdFromHeader.mockReturnValue(userId);
    mockedGetProjectWithTopics.mockResolvedValue(mockProject as any);

    const req = createMockGetRequest();
    const params = createMockParams({ projectId });

    const response = await GET(req, params);
    const data = await expectSuccessResponse(response, 200);

    expect(data.id).toBe(projectId);
    expect(mockedGetProjectWithTopics).toHaveBeenCalledWith(projectId);
  });

  it('존재하지 않는 프로젝트를 조회하면 404 에러를 반환한다', async () => {
    mockedRequireUserIdFromHeader.mockReturnValue(userId);
    mockedGetProjectWithTopics.mockResolvedValue(null);

    const req = createMockGetRequest();
    const params = createMockParams({ projectId });

    const response = await GET(req, params);
    await expectErrorResponse(response, 404, 'PROJECT_NOT_FOUND');
  });
});

describe('PATCH /api/projects/[projectId]', () => {
  const projectId = 'project-1';
  const userId = 'user-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('헤더가 없으면 throw한다', async () => {
    mockedRequireUserIdFromHeader.mockImplementation(() => {
      throw new Error('Missing x-user-id header');
    });

    const req = createMockRequest({ title: 'Updated Title' });
    const params = createMockParams({ projectId });

    await expect(PATCH(req, params)).rejects.toThrow();
  });

  it('성공적으로 프로젝트를 수정한다', async () => {
    const mockProject = { id: projectId, title: 'Updated Title', description: 'Updated Desc' };

    mockedRequireUserIdFromHeader.mockReturnValue(userId);
    mockedUpdateProject.mockResolvedValue(mockProject as any);

    const req = createMockRequest({ title: 'Updated Title', description: 'Updated Desc' });
    const params = createMockParams({ projectId });

    const response = await PATCH(req, params);
    const data = await expectSuccessResponse(response, 200);

    expect(data.title).toBe('Updated Title');
    expect(mockedUpdateProject).toHaveBeenCalledWith(projectId, 'Updated Title', 'Updated Desc');
  });
});
