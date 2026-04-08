import { signOut } from 'next-auth/react';
import { cva } from 'class-variance-authority';
import { useUserMutation } from '@/hooks/user/use-user-mutation';
import { cn } from '@/lib/utils/cn';

interface ActionButtonProps
  extends React.ComponentProps<'button'> {
  variant?: 'logout' | 'delete';
}

const actionButtonVariants = cva(
  'flex items-center gap-2 bg-transparent border-none cursor-pointer text-medium font-medium',
  {
    variants: {
      variant: {
        logout: 'text-gray-400 hover:text-gray-600',
        delete: 'text-red-400 hover:text-red-600',
      },
    },
    defaultVariants: {
      variant: 'logout',
    },
  }
);

export default function AccountActions() {
  const { withdrawMutation } = useUserMutation();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleWithdraw = () => {
    if (!confirm('정말로 탈퇴하시겠습니까? 탈퇴 시 모든 데이터가 삭제됩니다.')) {
      return;
    }
    withdrawMutation.mutate();
  };

  return (
    <div className="flex justify-between gap-5 px-5">
      <ActionButton
        variant="logout"
        onClick={handleLogout}
      >
        로그아웃
      </ActionButton>
      <ActionButton
        variant="delete"
        onClick={handleWithdraw}
      >
        회원탈퇴
      </ActionButton>
    </div>
  );
}

export function ActionButton({ variant, className, children, ...props }: ActionButtonProps) {
  return (
    <button className={cn(actionButtonVariants({ variant, className }))} {...props}>
      {children}
    </button>
  );
}
