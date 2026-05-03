import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createConnection as createConnectionAPI,
  deleteConnection as deleteConnectionAPI,
  updateNodePosition as updateNodePositionAPI,
} from '@/lib/api/issue-map';
import type { IssueConnection, IssueNode } from '@/issues/types';
import { queryKeys } from '@/lib/query-keys';

export const useTopicMutations = (topicId: string) => {
  const queryClient = useQueryClient();

  // 연결 생성
  const createConnectionMutation = useMutation({
    meta: { errorLabel: '연결 생성 실패', errorMessage: '연결 생성에 실패했습니다.' },
    mutationFn: async (data: {
      sourceIssueId: string;
      targetIssueId: string;
      sourceHandle: string | null;
      targetHandle: string | null;
    }) => {
      return createConnectionAPI(topicId, data);
    },
    onMutate: async (newConnection) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.topics.connections(topicId) });

      // 이전 데이터 스냅샷 저장
      const previousConnections = queryClient.getQueryData<IssueConnection[]>([
        'topics',
        topicId,
        'connections',
      ]);

      // 낙관적 업데이트: 임시 ID로 즉시 추가
      if (previousConnections) {
        const optimisticConnection: IssueConnection = {
          id: `temp-${Date.now()}`,
          ...newConnection,
        };
        queryClient.setQueryData<IssueConnection[]>(
          queryKeys.topics.connections(topicId),
          [...previousConnections, optimisticConnection],
        );
      }

      return { previousConnections };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousConnections) {
        queryClient.setQueryData(queryKeys.topics.connections(topicId), context.previousConnections);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.connections(topicId) });
    },
  });

  // 연결 삭제
  const deleteConnectionMutation = useMutation({
    meta: { errorLabel: '연결 삭제 실패', errorMessage: '연결 삭제에 실패했습니다.' },
    mutationFn: async (connectionId: string) => {
      return deleteConnectionAPI(topicId, connectionId);
    },
    onMutate: async (connectionId) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.topics.connections(topicId) });

      // 이전 데이터 스냅샷 저장
      const previousConnections = queryClient.getQueryData<IssueConnection[]>([
        'topics',
        topicId,
        'connections',
      ]);

      // 낙관적 업데이트로 즉시 제거
      if (previousConnections) {
        queryClient.setQueryData<IssueConnection[]>(
          queryKeys.topics.connections(topicId),
          previousConnections.filter((conn) => conn.id !== connectionId),
        );
      }

      return { previousConnections };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousConnections) {
        queryClient.setQueryData(queryKeys.topics.connections(topicId), context.previousConnections);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.connections(topicId) });
    },
  });

  // 노드 위치 업데이트
  const updateNodePositionMutation = useMutation({
    meta: { errorLabel: '노드 위치 업데이트 실패', errorMessage: '노드 위치 업데이트에 실패했습니다.' },
    mutationFn: async ({
      nodeId,
      positionX,
      positionY,
    }: {
      nodeId: string;
      positionX: number;
      positionY: number;
    }) => {
      return updateNodePositionAPI(topicId, nodeId, { positionX, positionY });
    },
    onMutate: async ({ nodeId, positionX, positionY }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.topics.nodes(topicId) });

      // 이전 데이터 스냅샷 저장
      const previousNodes = queryClient.getQueryData<IssueNode[]>(queryKeys.topics.nodes(topicId));

      // 낙관적 업데이트로 즉시 위치 변경
      if (previousNodes) {
        queryClient.setQueryData<IssueNode[]>(
          queryKeys.topics.nodes(topicId),
          previousNodes.map((node) => {
            if (node.id !== nodeId) return node;
            return {
              ...node,
              positionX,
              positionY,
            };
          }),
        );
      }

      return { previousNodes };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNodes) {
        queryClient.setQueryData(queryKeys.topics.nodes(topicId), context.previousNodes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.nodes(topicId) });
    },
  });

  return {
    createConnection: createConnectionMutation.mutate,
    deleteConnection: deleteConnectionMutation.mutate,
    updateNodePosition: updateNodePositionMutation.mutate,
    isCreatingConnection: createConnectionMutation.isPending,
    isDeletingConnection: deleteConnectionMutation.isPending,
    isUpdatingNodePosition: updateNodePositionMutation.isPending,
  };
};
