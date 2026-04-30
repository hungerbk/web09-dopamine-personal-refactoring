import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> },
) {
  const { topicId } = await params;

  try {
    const nodes = await prisma.issueNode.findMany({
      where: {
        deletedAt: null,
        issue: {
          topicId,
          deletedAt: null,
        },
      },
      select: {
        id: true,
        issueId: true,
        positionX: true,
        positionY: true,
      },
    });

    return createSuccessResponse(nodes, 200);
  } catch (error) {
    return handleApiError(error, 'NODES_FETCH_FAILED');
  }
}
