import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string; nodeId: string }> },
) {
  const { nodeId } = await params;
  const { positionX, positionY } = await req.json();

  if (positionX === undefined || positionY === undefined) {
    return createErrorResponse('POSITION_REQUIRED', 400);
  }

  try {
    const node = await prisma.issueNode.update({
      where: {
        id: nodeId,
      },
      data: {
        positionX,
        positionY,
      },
    });

    return createSuccessResponse(node, 200);
  } catch (error) {
    return handleApiError(error, 'NODE_UPDATE_FAILED');
  }
}
