'use client';

import { memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Node, NodeProps, Position } from '@xyflow/react';
import { ISSUE_STATUS } from '@/constants/issue';
import { IssueStatus } from '@/issues/types';
import { useTopicHoverContext } from '../issue-hover-context';
import IssueHandle from './issue-handle';
import { cn } from '@/lib/utils/cn';

export interface TopicNodeData extends Record<string, unknown> {
  title?: string;
  status?: IssueStatus;
}

const getNodeStatusClasses = (status: IssueStatus) => {
  switch (status) {
    case ISSUE_STATUS.BRAINSTORMING:
      return 'outline outline-2 outline-yellow-400 bg-white';
    case ISSUE_STATUS.CATEGORIZE:
      return 'outline outline-2 outline-blue-400 bg-white';
    case ISSUE_STATUS.VOTE:
      return 'outline outline-2 outline-red-400 bg-white';
    case ISSUE_STATUS.SELECT:
      return 'outline outline-2 outline-green-600 bg-white';
    case ISSUE_STATUS.CLOSE:
      return 'outline outline-2 outline-gray-500 bg-gray-100';
    default:
      return 'outline outline-2 outline-gray-300 bg-gray-100';
  }
};

const getBadgeStatusClasses = (status: IssueStatus) => {
  switch (status) {
    case ISSUE_STATUS.BRAINSTORMING:
      return 'bg-yellow-100 text-yellow-600';
    case ISSUE_STATUS.CATEGORIZE:
      return 'bg-blue-100 text-blue-600';
    case ISSUE_STATUS.VOTE:
      return 'bg-red-100 text-red-600';
    case ISSUE_STATUS.SELECT:
      return 'bg-green-100 text-green-600';
    case ISSUE_STATUS.CLOSE:
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};

const getTitleStatusClasses = (status: IssueStatus) => {
  if (status === ISSUE_STATUS.CLOSE) {
    return 'text-gray-500';
  }
  return 'text-gray-900';
};

function TopicNode({ id, data }: NodeProps<Node<TopicNodeData>>) {
  const router = useRouter();
  const title = data.title;
  const status = data.status ?? ISSUE_STATUS.CLOSE;
  const { hoveredNodeId, connectedNodeIds } = useTopicHoverContext();
  const dimmed = hoveredNodeId ? !connectedNodeIds.has(id) : false;

  const handleClick = useCallback(() => {
    router.push(`/issues/${id}`);
  }, [id, router]);

  return (
    <div
      className={cn(
        'flex h-fit w-[250px] cursor-pointer flex-col gap-3 rounded-large p-5 text-black shadow-md transition-opacity duration-200 ease-in-out',
        dimmed ? 'opacity-30' : 'opacity-100',
        getNodeStatusClasses(status)
      )}
      onClick={handleClick}
    >
      <div className="flex justify-end mb-2">
        <div className={cn('rounded-large px-3 py-1 text-small font-bold', getBadgeStatusClasses(status))}>
          {status}
        </div>
      </div>

      <div className="flex justify-start mb-2">
        <div className={cn('text-large font-bold', getTitleStatusClasses(status))}>
          {title}
        </div>
      </div>

      {/* Top Handles */}
      <IssueHandle
        type="target"
        status={status}
        position={Position.Top}
        id="top-target"
      />
      <IssueHandle
        type="source"
        status={status}
        position={Position.Top}
        id="top-source"
      />

      {/* Bottom Handles */}
      <IssueHandle
        type="target"
        status={status}
        position={Position.Bottom}
        id="bottom-target"
      />
      <IssueHandle
        type="source"
        status={status}
        position={Position.Bottom}
        id="bottom-source"
      />

      {/* Left Handles */}
      <IssueHandle
        type="target"
        status={status}
        position={Position.Left}
        id="left-target"
      />
      <IssueHandle
        type="source"
        status={status}
        position={Position.Left}
        id="left-source"
      />

      {/* Right Handles */}
      <IssueHandle
        type="target"
        status={status}
        position={Position.Right}
        id="right-target"
      />
      <IssueHandle
        type="source"
        status={status}
        position={Position.Right}
        id="right-source"
      />
    </div>
  );
}

export function IssueNodeSkeleton() {
  return (
    <div className="border border-dashed border-gray-200 bg-[rgba(0,0,0,0.02)] rounded-large w-[250px] p-5 flex flex-col gap-3 shadow-[0_4px_6px_rgba(0,0,0,0.06)]">
      <div className="self-end w-16 h-5 rounded-large bg-gray-100 animate-pulse" />
      <div className="w-[70%] h-[18px] rounded-lg bg-gray-100 animate-pulse" />
      <div className="w-[40%] h-[14px] rounded-lg bg-gray-100 animate-pulse" />
    </div>
  );
}

export default memo(TopicNode);
