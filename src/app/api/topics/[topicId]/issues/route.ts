import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';
import { IssueRole } from '@prisma/client';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { issueMemberRepository } from '@/lib/repositories/issue-member.repository';
import { createIssue } from '@/lib/repositories/issue.repository';
import { requireUserIdFromHeader } from '@/lib/utils/api-auth';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;

  try {
    const issues = await prisma.issue.findMany({
      where: {
        topicId,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return createSuccessResponse(issues, 200);
  } catch (error) {
    return handleApiError(error, 'ISSUES_FETCH_FAILED');
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ topicId: string }> }) {
  const userId = requireUserIdFromHeader(req);
  const { topicId } = await params;
  const { title } = await req.json();

  if (!title) {
    return createErrorResponse('TITLE_REQUIRED', 400);
  }

  const session = await getServerSession(authOptions);

  try {
    const issueId = await prisma.$transaction(async (tx) => {
      const issue = await createIssue(tx, title, topicId);

      await issueMemberRepository.addIssueMember(tx, {
        issueId: issue.id,
        userId,
        nickname: session?.user?.name || '익명',
        role: IssueRole.OWNER,
      });

      return issue.id;
    });

    return createSuccessResponse({ issueId: issueId }, 201);
  } catch (error) {
    return handleApiError(error, 'ISSUE_CREATE_FAILED');
  }
}
