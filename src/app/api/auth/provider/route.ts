import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import * as userRepository from '@/lib/repositories/user.repository';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/utils/api-helpers';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createErrorResponse('UNAUTHORIZED', 401);
    }

    const providers = await userRepository.getUserProviders(session.user.id);

    return createSuccessResponse(providers);
  } catch (error) {
    return handleApiError(error, 'GET_PROVIDERS_ERROR');
  }
}
