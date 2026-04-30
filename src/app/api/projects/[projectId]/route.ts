import { NextRequest } from 'next/server';
import * as projectRepository from '@/lib/repositories/project.repository';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  requireUserIdFromHeader(req);

  const { projectId } = await params;

  try {
    const project = await projectRepository.getProjectWithTopics(projectId);

    if (!project) {
      return createErrorResponse('PROJECT_NOT_FOUND', 404);
    }

    return createSuccessResponse(project, 200);
  } catch (error) {
    return handleApiError(error, 'PROJECT_FETCH_FAILED');
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> },
) {
  requireUserIdFromHeader(req);

  const { projectId } = await params;
  const { title, description } = await req.json();

  try {
    const project = await projectRepository.updateProject(projectId, title, description);
    return createSuccessResponse(project, 200);
  } catch (error) {
    return handleApiError(error, 'PROJECT_UPDATE_FAILED');
  }
}
