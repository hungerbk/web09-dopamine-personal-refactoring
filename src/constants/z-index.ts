/**
 * tailwind.config.ts의 zIndex 설정과 동기화 유지
 * - Tailwind className 사용 불가한 인라인 style 컨텍스트에서 사용
 * - className 컨텍스트에서는 z-selected, z-important 등 Tailwind 클래스 사용
 */
export const Z_INDEX = {
  hide: -1,
  base: 0,
  important: 9999,

  selected: 100, // idea card - isHotIdea 상태 등

  sticky: 200, // 필터 패널, 프로그레스 바, 줌 컨트롤
  backdrop: 300, // 모달 배경
  modal: 400, // 모달, 다이얼로그
  popover: 500, // 툴팁, 팝오버
  overlay: 600, // 전역 오버레이
} as const;
