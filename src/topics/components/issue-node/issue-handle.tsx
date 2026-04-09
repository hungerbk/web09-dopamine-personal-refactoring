import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { IssueStatus } from '@/issues/types';
import './issue-handle.css';

interface IssueHandleProps {
  type: 'source' | 'target';
  position: Position;
  status: IssueStatus;
  id: string;
  isConnectable?: boolean;
}

const HANDLE_BASE_STYLE = {
  width: 10,
  height: 10,
  borderRadius: 16,
  border: 'none',
  opacity: 0,
  transition: 'opacity 0.2s',
};

const STATUS_HANDLE_BG: Record<IssueStatus, string> = {
  BRAINSTORMING: 'bg-yellow-500',
  CATEGORIZE: 'bg-blue-500',
  VOTE: 'bg-red-500',
  SELECT: 'bg-green-500',
  CLOSE: 'bg-gray-500',
};

function IssueHandle({ type, position, id, status, isConnectable = true }: IssueHandleProps) {
  return (
    <Handle
      type={type}
      position={position}
      id={id}
      style={HANDLE_BASE_STYLE}
      className={STATUS_HANDLE_BG[status]}
      isConnectable={isConnectable}
    />
  );
}

export default memo(IssueHandle);
