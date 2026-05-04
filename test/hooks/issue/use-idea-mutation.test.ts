/**
 * @jest-environment jsdom
 */
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useSseConnectionStore } from '@/issues/store/use-sse-connection-store';
import { useIdeaMutations } from '@/hooks';
import * as ideaApi from '@/lib/api/idea';
import { queryKeys } from '@/lib/query-keys';
import { act, renderHook, waitFor } from '../../utils/test-utils';

// 1. 의존성 모킹
jest.mock('@/lib/api/idea');
jest.mock('react-hot-toast');
jest.mock('@/issues/store/use-sse-connection-store', () => ({
  useSseConnectionStore: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => {
  const original = jest.requireActual('@tanstack/react-query');
  return {
    ...original,
    useQueryClient: jest.fn(),
  };
});

describe('useIdeaMutations (Full Coverage)', () => {
  const issueId = 'issue-1';
  const connectionId = 'conn-1';
  const queryKey = queryKeys.issues.ideas(issueId);

  const mockCreateIdea = ideaApi.createIdea as jest.Mock;
  const mockUpdateIdea = ideaApi.updateIdea as jest.Mock;
  const mockDeleteIdea = ideaApi.deleteIdea as jest.Mock;
  const mockToastError = toast.error as jest.Mock;

  const mockGetQueryData = jest.fn();
  const mockSetQueryData = jest.fn();
  const mockCancelQueries = jest.fn();
  const mockInvalidateQueries = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useQueryClient as jest.Mock).mockReturnValue({
      getQueryData: mockGetQueryData,
      setQueryData: mockSetQueryData,
      cancelQueries: mockCancelQueries,
      invalidateQueries: mockInvalidateQueries,
    });

    (useSseConnectionStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({ connectionIds: { [issueId]: connectionId } }),
    );

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('createIdea', () => {
    test('성공 시 setQueryData를 통해 캐시를 업데이트해야 한다 (onSettled 없음)', async () => {
      mockCreateIdea.mockResolvedValue({ id: 'new-id', content: 'New' });
      const { result } = renderHook(() => useIdeaMutations(issueId));

      act(() => {
        result.current.createIdea({ userId: 'u1', categoryId: null, content: 'New' });
      });

      await waitFor(() => expect(result.current.isCreating).toBe(false));
      expect(mockSetQueryData).toHaveBeenCalledWith(queryKey, expect.any(Function));
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
    });

    test('실패 시 에러 토스트를 띄워야 한다', async () => {
      mockCreateIdea.mockRejectedValue(new Error('생성 실패'));
      const { result } = renderHook(() => useIdeaMutations(issueId));
      act(() => {
        result.current.createIdea({ content: 'Fail' } as any);
      });
      await waitFor(() => expect(mockToastError).toHaveBeenCalledWith('생성 실패'));
    });
  });

  describe('transform Logic Branch', () => {
    test('작성자 이름 결정 우선순위: nickname > displayName > name > 알 수 없음', async () => {
      const { result } = renderHook(() => useIdeaMutations(issueId));

      const testCases = [
        { input: { issueMember: { nickname: 'N' }, user: { displayName: 'D' } }, expected: 'N' },
        { input: { user: { displayName: 'D', name: 'M' } }, expected: 'D' },
        { input: { user: { name: 'M' } }, expected: 'M' },
        { input: {}, expected: '알 수 없음' },
      ];

      for (const { input, expected } of testCases) {
        mockCreateIdea.mockResolvedValue({ id: '1', ...input });
        await act(async () => {
          result.current.createIdea({ content: 'T' } as any);
        });
        const updater = mockSetQueryData.mock.calls[mockSetQueryData.mock.calls.length - 1][1];
        expect(updater([])[0].author).toBe(expected);
      }
    });

    test('좌표 X/Y 중 하나라도 null이면 position 객체 자체가 null이어야 한다', async () => {
      mockCreateIdea.mockResolvedValue({ id: '1', positionX: 10, positionY: null });
      const { result } = renderHook(() => useIdeaMutations(issueId));
      await act(async () => {
        result.current.createIdea({ content: 'T' } as any);
      });
      const updater = mockSetQueryData.mock.calls[0][1];
      expect(updater([])[0].position).toBeNull();
    });
  });

  describe('updateIdea Branching', () => {
    const initial = [{ id: 'idea-1', content: 'O', position: { x: 1, y: 1 }, categoryId: 'c1' }];

    test('성공 시 모든 변경사항(위치, 카테고리)을 낙관적으로 반영하고 무효화한다', async () => {
      mockGetQueryData.mockReturnValue(initial);
      mockUpdateIdea.mockResolvedValue({});
      const { result } = renderHook(() => useIdeaMutations(issueId));

      await act(async () => {
        result.current.updateIdea({
          ideaId: 'idea-1',
          positionX: 0,
          positionY: 0,
          categoryId: 'c2',
        });
      });

      const passedData = mockSetQueryData.mock.calls[0][1];
      expect(passedData[0].position).toEqual({ x: 0, y: 0 }); // 0값 유효 체크
      expect(passedData[0].categoryId).toBe('c2');
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey });
    });

    test('좌표값이 누락(undefined)되면 기존 위치를 유지해야 한다', async () => {
      mockGetQueryData.mockReturnValue(initial);
      const { result } = renderHook(() => useIdeaMutations(issueId));

      await act(async () => {
        result.current.updateIdea({ ideaId: 'idea-1', positionX: 100 }); // Y 누락
      });

      const passedData = mockSetQueryData.mock.calls[0][1];
      expect(passedData[0].position).toEqual({ x: 1, y: 1 }); // 기존값 유지
    });

    test('실패 시 롤백 로직 분기 (Context 유무에 따른 차이)', async () => {
      mockUpdateIdea.mockRejectedValue(new Error('Fail'));

      // 케이스 1: 캐시 있음 -> 롤백 실행
      mockGetQueryData.mockReturnValue(initial);
      const { result: r1 } = renderHook(() => useIdeaMutations(issueId));
      await act(async () => {
        r1.current.updateIdea({ ideaId: '1' } as any);
      });
      expect(mockSetQueryData).toHaveBeenLastCalledWith(queryKey, initial);

      // 케이스 2: 캐시 없음 -> 롤백 스킵
      mockGetQueryData.mockReturnValue(undefined);
      const { result: r2 } = renderHook(() => useIdeaMutations(issueId));
      await act(async () => {
        r2.current.updateIdea({ ideaId: '1' } as any);
      });
      expect(mockSetQueryData).not.toHaveBeenLastCalledWith(queryKey, undefined);
    });
  });

  describe('removeIdea', () => {
    const initial = [{ id: '1' }, { id: '2' }];

    test('성공 시 낙관적 삭제 및 무효화를 수행한다', async () => {
      mockGetQueryData.mockReturnValue(initial);
      mockDeleteIdea.mockResolvedValue({});
      const { result } = renderHook(() => useIdeaMutations(issueId));

      await act(async () => {
        result.current.removeIdea('1');
      });

      expect(mockSetQueryData).toHaveBeenCalledWith(queryKey, [{ id: '2' }]);
      expect(mockInvalidateQueries).toHaveBeenCalledWith({ queryKey });
    });
  });

  describe('Pending States', () => {
    test('isCreating 상태가 올바르게 전이되어야 한다', async () => {
      mockCreateIdea.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useIdeaMutations(issueId));

      expect(result.current.isCreating).toBe(false);

      act(() => {
        result.current.createIdea({ content: 'Wait' } as any);
      });

      // 💡 waitFor를 사용하여 React Query의 내부 상태 업데이트 대기
      await waitFor(() => expect(result.current.isCreating).toBe(true));
    });

    test('isUpdating/isRemoving 상태 전이 확인', async () => {
      mockUpdateIdea.mockReturnValue(new Promise(() => {}));
      const { result } = renderHook(() => useIdeaMutations(issueId));

      act(() => {
        result.current.updateIdea({ ideaId: '1' } as any);
      });
      await waitFor(() => expect(result.current.isUpdating).toBe(true));
    });
  });

  test('createIdea - 기존 캐시가 없을 때 빈 배열로 기본값 처리되는지 확인', async () => {
    mockCreateIdea.mockResolvedValue({ id: 'new' });
    const { result } = renderHook(() => useIdeaMutations(issueId));
    await act(async () => {
      result.current.createIdea({ content: 'T' } as any);
    });

    const updater = mockSetQueryData.mock.calls[0][1];
    expect(updater(undefined)).toHaveLength(1);
  });
});
