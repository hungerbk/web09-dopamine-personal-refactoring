import { useEffect, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';
import { STATUS_LABEL, STEP_FLOW } from '@/constants/issue';
import { useIssueData, useIssueId } from '../../hooks';

const PROGRESS_BAR_DURATION = 0.3;

const circleVariants = cva(
  'relative z-sticky flex h-7 w-7 items-center justify-center rounded-full text-white shadow-[2px_0_2px_-1px_rgba(0,0,0,0.2)] transition-all duration-300',
  {
    variants: {
      active: {
        true: 'bg-green-600',
        false: 'bg-gray-300',
      },
    },
  },
);

const labelVariants = cva(
  'absolute -top-[65%] whitespace-nowrap text-small transition-all duration-300',
  {
    variants: {
      active: {
        true: 'text-green-600',
        false: 'text-gray-400',
      },
    },
  },
);

const ProgressBar = () => {
  const issueId = useIssueId();
  const { status } = useIssueData(issueId);
  const [animatedIndex, setAnimatedIndex] = useState(0);

  useEffect(() => {
    const targetIndex = STEP_FLOW.indexOf(status);
    if (targetIndex <= animatedIndex) return;

    let i = animatedIndex;

    const interval = setInterval(() => {
      i += 1;
      setAnimatedIndex(i);

      if (i >= targetIndex) {
        clearInterval(interval);
      }
    }, PROGRESS_BAR_DURATION * 1000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="mt-4 flex w-full items-center">
      {STEP_FLOW.map((step, index) => {
        const isActive = index <= animatedIndex;
        const isLineActive = index < animatedIndex;
        const showLine = index < STEP_FLOW.length - 1;

        return (
          <div
            key={step}
            className={cn(
              'relative flex flex-1 items-center last:w-auto last:flex-none',
            )}
          >
            {showLine && (
              <div className="absolute left-[2px] top-1/2 h-1.5 w-full -translate-y-1/2 bg-gray-300 shadow-[2px_2px_1px_-1px_rgba(0,0,0,0.2)]">
                <div
                  className="absolute left-0 top-0 h-full bg-green-600 transition-all ease-in"
                  style={{
                    width: isLineActive ? '100%' : '0',
                    transitionDuration: `${PROGRESS_BAR_DURATION}s`,
                  }}
                />
              </div>
            )}
            <div
              className={cn(circleVariants({ active: isActive }))}
              style={{ transitionDelay: `${PROGRESS_BAR_DURATION}s` }}
            >
              {index + 1}
              <span
                className={cn(labelVariants({ active: isActive }))}
                style={{ transitionDelay: `${PROGRESS_BAR_DURATION}s` }}
              >
                {STATUS_LABEL[step]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
