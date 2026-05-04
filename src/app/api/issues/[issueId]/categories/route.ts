import { NextRequest, NextResponse } from 'next/server';
import { SSE_EVENT_TYPES } from '@/constants/sse-events';
import { categoryRepository } from '@/lib/repositories/category.repository';
import { broadcast } from '@/lib/sse/sse-service';
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from '@/lib/utils/api-helpers';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
): Promise<NextResponse> {
  const { issueId } = await params;

  try {
    const categories = await categoryRepository.findByIssueId(issueId);

    return createSuccessResponse(categories);
  } catch (error) {
    return handleApiError(error, 'INTERNAL_SERVER_ERROR');
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string }> },
): Promise<NextResponse> {
  const { issueId } = await params;
  const { title, positionX, positionY, width, height } = await req.json();
  const actorConnectionId = req.headers.get('x-sse-connection-id') || undefined;

  try {
    // 카테고리 중복 확인
    const existingCategory = await categoryRepository.findByTitle(issueId, title);
    if (existingCategory) {
      return createErrorResponse('CATEGORY_ALREADY_EXISTS', 400);
    }

    const category = await categoryRepository.create({
      issueId,
      title,
      positionX,
      positionY,
      width,
      height,
    });

    broadcast({
      issueId,
      excludeConnectionId: actorConnectionId,
      event: {
        type: SSE_EVENT_TYPES.CATEGORY_CREATED,
        data: { categoryId: category.id },
      },
    });

    return createSuccessResponse(category, 201);
  } catch (error) {
    return handleApiError(error, 'CATEGORY_CREATE_FAILED');
  }
}
