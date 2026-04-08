import { useEffect, useState } from 'react';
import { getProviders } from '@/lib/api/auth';
import { getProviderInfo } from '@/lib/utils/provider-info';

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
    <div className="flex w-[450px] flex-col gap-2 rounded-[12px] bg-gray-50 p-5">
      <div className="mb-3 flex items-center gap-2">
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
        <h3 className="m-0 text-[14px] font-[700] text-black">로그인 정보</h3>
      </div>
      {providers.map((provider, i) => {
        const { name, icon, color } = getProviderInfo(provider);

        return (
          <div
            key={provider ?? i}
            className="flex items-center justify-between rounded-[8px] border border-gray-200 bg-white px-[11px] py-[15px]"
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-[12px] font-[700] text-blue-500"
                style={{ color }}
              >
                {icon}
              </div>
              <span className="text-[12px] font-[700] text-gray-700">{name}</span>
            </div>
            <div className="rounded-[12px] bg-green-50 px-3 py-1.5 text-[10px] font-[700] uppercase text-green-600">
              CONNECTED
            </div>
          </div>
        );
      })}
    </div>
  );
}
