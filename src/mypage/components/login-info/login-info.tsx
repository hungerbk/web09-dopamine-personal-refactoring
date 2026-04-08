import { useEffect, useState } from 'react';
import { getProviders } from '@/lib/api/auth';
import { getProviderInfo } from '@/lib/utils/provider-info';
import { cn } from '@/lib/utils/cn';

export function Container({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('w-[450px] flex flex-col gap-2 bg-gray-50 p-5 rounded-[12px]', className)} {...props}>
      {children}
    </div>
  );
}

export function Header({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-2 mb-3', className)} {...props}>
      {children}
    </div>
  );
}

export function Title({ children, className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3 className={cn('text-[14px] font-[700] text-black m-0', className)} {...props}>
      {children}
    </h3>
  );
}

export function LoginCard({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-white border border-gray-200 rounded-[8px] py-[15px] px-[11px] flex items-center justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LoginInfoWrapper({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function ProviderIcon({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-[700] text-blue-500 text-[12px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ProviderText({ children, className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('text-[12px] font-[700] text-gray-700', className)} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-green-50 text-green-600 py-1.5 px-3 rounded-[12px] text-[10px] font-[700] uppercase',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default function LoginInfo() {
  const [providers, setProviders] = useState<string[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };

    fetchProviders();
  }, []);

  return (
    <Container>
      <Header>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <Title>로그인 정보</Title>
      </Header>
      {providers.map((provider, i) => {
        const { name, icon, color } = getProviderInfo(provider);

        return (
          <LoginCard key={provider ?? i}>
            <LoginInfoWrapper>
              <ProviderIcon style={{ color }}>{icon}</ProviderIcon>
              <ProviderText>{name}</ProviderText>
            </LoginInfoWrapper>
            <StatusBadge>CONNECTED</StatusBadge>
          </LoginCard>
        );
      })}
    </Container>
  );
}
