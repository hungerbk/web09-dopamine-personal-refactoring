'use client';

import FloatingShapes from './floating-shapes';

export default function Background() {
  return (
    <div className="fixed left-0 top-0 -z-10 h-full w-full overflow-hidden bg-white">
      <div
        className="absolute -bottom-[10%] -left-[10%] h-[40vw] w-[40vw] rounded-full opacity-40 mix-blend-multiply blur-[100px]"
        style={{ background: '#60a5fa' }}
      />
      <div
        className="absolute -right-[10%] -top-[10%] h-[40vw] w-[40vw] rounded-full opacity-40 mix-blend-multiply blur-[100px]"
        style={{ background: '#00a94f' }}
      />
      <FloatingShapes />
    </div>
  );
}
