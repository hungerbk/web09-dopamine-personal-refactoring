import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { withdraw, updateDisplayName } from '@/lib/api/auth';

export const useUserMutation = () => {
  const queryClient = useQueryClient();

  const withdrawMutation = useMutation({
    meta: { errorLabel: '회원탈퇴 에러', errorMessage: '회원탈퇴 중 오류가 발생했습니다.' },
    mutationFn: () => withdraw(),
    onSuccess: async () => {
      toast.success('회원탈퇴가 완료되었습니다.');
      queryClient.clear();
      await signOut({ callbackUrl: '/' });
    },
  });

  const updateDisplayNameMutation = useMutation({
    meta: { errorLabel: '이름 변경 에러' },
    mutationFn: (displayName: string) => updateDisplayName(displayName),
    onSuccess: () => {
      toast.success('보여질 이름이 변경되었습니다.');
    },
  });

  return { withdrawMutation, updateDisplayNameMutation };
};
