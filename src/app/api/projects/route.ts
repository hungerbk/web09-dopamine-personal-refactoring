import { NextRequest } from 'next/server';
import * as projectRepository from '@/lib/repositories/project.repository';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function GET(req: NextRequest) {
  const ownerId = requireUserIdFromHeader(req);

  try {
    // 참여중인 프로젝트(소유/게스트 포함) 조회
    const projects = await projectRepository.getProjectsByUserMembership(ownerId);
    return createSuccessResponse(projects, 200);
  } catch (error) {
    return handleApiError(error, 'PROJECT_LIST_FAILED');
  }
}

export async function POST(req: NextRequest) {
  const ownerId = requireUserIdFromHeader(req);

  const { title, description } = await req.json();

  if (!title) {
    return createErrorResponse('TITLE_REQUIRED', 400);
  }

  try {
    const result = await projectRepository.createProject(title, ownerId, description);
    return createSuccessResponse(result, 201);
  } catch (error) {
    return handleApiError(error, 'PROJECT_CREATE_FAILED');
  }
}

export async function DELETE(req: NextRequest) {
  const ownerId = requireUserIdFromHeader(req);

  const { id } = await req.json();

  if (!id) {
    return createErrorResponse('ID_REQUIRED', 400);
  }

  try {
    const result = await projectRepository.deleteProject(id, ownerId);
    return createSuccessResponse(result, 200);
  } catch (error) {
    return handleApiError(error, 'PROJECT_DELETE_FAILED');
  }
}
