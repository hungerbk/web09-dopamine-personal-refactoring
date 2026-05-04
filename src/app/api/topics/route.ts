import { NextRequest } from 'next/server';
import * as topicRepository from '@/lib/repositories/topic.repository';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function POST(req: NextRequest) {
  requireUserIdFromHeader(req);

  const { title, projectId } = await req.json();

  if (!title) {
    return createErrorResponse('TITLE_REQUIRED', 400);
  }

  if (!projectId) {
    return createErrorResponse('PROJECT_ID_REQUIRED', 400);
  }

  try {
    const result = await topicRepository.createTopic(title, projectId);
    return createSuccessResponse(result, 201);
  } catch (error) {
    return handleApiError(error, 'TOPIC_CREATE_FAILED');
  }
}
