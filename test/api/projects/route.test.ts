import { GET, POST, DELETE } from '@/app/api/projects/route';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';
import * as projectRepository from '@/lib/repositories/project.repository';
import {
  createMockGetRequest,
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
const mockedGetProjectsByUserMembership =
  projectRepository.getProjectsByUserMembership as jest.MockedFunction<
    typeof projectRepository.getProjectsByUserMembership
  >;
const mockedCreateProject = projectRepository.createProject as jest.MockedFunction<
  typeof projectRepository.createProject
>;
const mockedDeleteProject = projectRepository.deleteProject as jest.MockedFunction<
  typeof projectRepository.deleteProject
>;

describe('GET /api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('헤더가 없으면 throw한다 (proxy 매처 누락 시 발견)', async () => {
    mockedRequireUserIdFromHeader.mockImplementation(() => {
      throw new Error('Missing x-user-id header');
    });

    const req = createMockGetRequest();
    await expect(GET(req)).rejects.toThrow();
  });

  it('성공적으로 프로젝트 목록을 조회한다', async () => {
    const userId = 'user-1';
    const mockProjects = [
      { id: 'project-1', title: 'My Project' },
      { id: 'project-2', title: 'Guest Project' },
    ];

    mockedRequireUserIdFromHeader.mockReturnValue(userId);
    mockedGetProjectsByUserMembership.mockResolvedValue(mockProjects as any);

    const req = createMockGetRequest({ headers: { 'x-user-id': userId } });
    const response = await GET(req);
    const data = await expectSuccessResponse(response, 200);

    expect(data).toHaveLength(2);
    expect(mockedGetProjectsByUserMembership).toHaveBeenCalledWith(userId);
  });
});

describe('POST /api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('헤더가 없으면 throw한다', async () => {
    mockedRequireUserIdFromHeader.mockImplementation(() => {
      throw new Error('Missing x-user-id header');
    });

    const req = createMockRequest({ title: 'New Project' });
    await expect(POST(req)).rejects.toThrow();
  });

  it('title이 없으면 400 에러를 반환한다', async () => {
    const userId = 'user-1';
    mockedRequireUserIdFromHeader.mockReturnValue(userId);

    const req = createMockRequest({});
    const response = await POST(req);
    await expectErrorResponse(response, 400, 'TITLE_REQUIRED');
  });

  it('성공적으로 프로젝트를 생성한다', async () => {
    const userId = 'user-1';
    const mockProject = { id: 'project-1', title: 'New Project' };

    mockedRequireUserIdFromHeader.mockReturnValue(userId);
    mockedCreateProject.mockResolvedValue(mockProject as any);

    const req = createMockRequest({ title: 'New Project', description: 'Description' });
    const response = await POST(req);
    const data = await expectSuccessResponse(response, 201);

    expect(data.id).toBe('project-1');
    expect(mockedCreateProject).toHaveBeenCalledWith('New Project', userId, 'Description');
  });
});

describe('DELETE /api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('헤더가 없으면 throw한다', async () => {
    mockedRequireUserIdFromHeader.mockImplementation(() => {
      throw new Error('Missing x-user-id header');
    });

    const req = createMockRequest({ id: 'project-1' });
    await expect(DELETE(req)).rejects.toThrow();
  });

  it('id가 없으면 400 에러를 반환한다', async () => {
    const userId = 'user-1';
    mockedRequireUserIdFromHeader.mockReturnValue(userId);

    const req = createMockRequest({});
    const response = await DELETE(req);
    await expectErrorResponse(response, 400, 'ID_REQUIRED');
  });

  it('성공적으로 프로젝트를 삭제한다', async () => {
    const userId = 'user-1';
    const projectId = 'project-1';

    mockedRequireUserIdFromHeader.mockReturnValue(userId);
    mockedDeleteProject.mockResolvedValue({ id: projectId } as any);

    const req = createMockRequest({ id: projectId });
    const response = await DELETE(req);
    const data = await expectSuccessResponse(response, 200);

    expect(data.id).toBe(projectId);
    expect(mockedDeleteProject).toHaveBeenCalledWith(projectId, userId);
  });
});
