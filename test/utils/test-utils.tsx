import React, { ReactElement } from 'react';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderHookOptions, RenderOptions, render, renderHook } from '@testing-library/react';
import toast from 'react-hot-toast';
import { AuthProvider } from '@/providers/auth-provider';

// 1. 전역 래퍼 (RootLayout 구조 반영)
const createWrapper = () => {
  // 테스트용 쿼리 클라이언트 (query-provider.tsx의 makeQueryClient와 동일한 설정)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        const label = mutation.meta?.errorLabel ?? '[Mutation Error]';
        console.error(`${label}:`, error);

        if (mutation.meta?.disableGlobalToast) return;

        const message = mutation.meta?.errorMessage
          || (error instanceof Error ? error.message : null)
          || '오류가 발생했습니다.';
        toast.error(message);
      },
    }),
  });

  return ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthProvider>
  );
};

// 2. 커스텀 render 함수 (컴포넌트용)
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: createWrapper(), ...options });

// 3. 커스텀 renderHook 함수 (훅용)
const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) => renderHook(render, { wrapper: createWrapper(), ...options });

// 4. RTL의 모든 기능을 그대로 내보내되, 커스텀 함수로 덮어씌움
export * from '@testing-library/react';
export { customRender as render };
export { customRenderHook as renderHook };
