import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string; connectionId: string }> },
) {
  const { connectionId } = await params;

  try {
    await prisma.issueConnection.update({
      where: {
        id: connectionId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return createSuccessResponse(null, 200);
  } catch (error) {
    return handleApiError(error, 'CONNECTION_DELETE_FAILED');
  }
}
