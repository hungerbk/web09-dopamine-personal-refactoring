import { NextRequest } from 'next/server';
import { SSE_EVENT_TYPES } from '@/constants/sse-events';
import { prisma } from '@/lib/prisma';
import { broadcast } from '@/lib/sse/sse-service';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ issueId: string; ideaId: string }> },
) {
  try {
    const { issueId, ideaId } = await params;
    const actorConnectionId = req.headers.get('x-sse-connection-id') || undefined;

    const idea = await prisma.idea.findFirst({
      where: {
        id: ideaId,
        issueId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!idea) {
      return createErrorResponse('IDEA_NOT_FOUND', 404);
    }

    // DB에 채택 상태 반영 (새로고침 후에도 유지)
    await prisma.$transaction([
      prisma.idea.updateMany({
        where: { issueId, deletedAt: null },
        data: { isSelected: false },
      }),
      prisma.idea.update({
        where: { id: ideaId },
        data: { isSelected: true },
      }),
    ]);

    broadcast({
      issueId,
      excludeConnectionId: actorConnectionId,
      event: {
        type: SSE_EVENT_TYPES.IDEA_SELECTED,
        data: { ideaId },
      },
    });

    return createSuccessResponse({ ok: true });
  } catch (error) {
    return handleApiError(error, 'IDEA_SELECTION_BROADCAST_FAILED');
  }
}
