import { SSEEventType } from '@/constants/sse-events';

export interface SSEEvent {
  type: SSEEventType;
  data: any;
}

export interface SSEConnectionInfo {
  issueId: string;
  userId: string | null;
}

export interface BroadcastingEvent {
  issueId: string;
  event: SSEEvent;
  excludeConnectionId?: string;
}
