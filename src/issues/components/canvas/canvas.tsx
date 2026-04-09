'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { CanvasContext } from './canvas-context';
import CanvasZoomControls from './canvas-zoom-controls';
import { useCanvasControls } from './use-canvas-controls';

interface CanvasProps {
  children?: React.ReactNode;
  onDoubleClick?: (position: { x: number; y: number }) => void;
  onCanvasClick: () => void;
  showGrid?: boolean;
  showControls?: boolean;
  showMessage?: boolean;
  showAddButton?: boolean;
  boundContent?: boolean;
  bottomMessage?: string;
  enableAddIdea?: boolean;
}

export default function Canvas({
  children,
  onDoubleClick,
  onCanvasClick,
  showGrid = true,
  showControls = true,
  showMessage = true,
  showAddButton = true,
  boundContent = false,
  bottomMessage = '',
  enableAddIdea = false,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    scale,
    offset,
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleCanvasDoubleClick,
    handleAddIdeaButtonClick,
  } = useCanvasControls({
    canvasRef,
    onDoubleClick,
    isAddIdeaEnabled: enableAddIdea,
    onCanvasClick,
  });

  return (
    <>
      <div
        ref={canvasRef}
        data-testid="issue-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleCanvasDoubleClick}
        className={cn(
          'relative h-full w-full overflow-hidden',
          showGrid &&
            'bg-gray-100 [background-image:linear-gradient(90deg,#dde2eb_1px,transparent_1px),linear-gradient(#dde2eb_1px,transparent_1px)] [background-size:40px_40px] [background-position:0_0]',
        )}
        style={{
          cursor: isPanning ? 'grabbing' : 'default',
        }}
      >
        <div
          className="relative origin-top-left transition-transform duration-75 ease-out"
          style={{
            width: boundContent ? 'auto' : '4000px',
            height: boundContent ? 'auto' : '4000px',
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          <CanvasContext.Provider value={{ scale }}>{children}</CanvasContext.Provider>
        </div>
      </div>

      {showControls && (
        <CanvasZoomControls
          scale={scale}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetZoom}
        />
      )}
      {showAddButton && enableAddIdea && (
        <button
          onClick={handleAddIdeaButtonClick}
          className="fixed bottom-[50px] right-[30px] rounded-large border-none bg-green-600 px-6 py-3 text-[16px] font-bold text-white shadow-[0_12px_16px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:scale-105"
        >
          아이디어 추가
        </button>
      )}
      {showMessage && (
        <div className="fixed bottom-[10px] left-1/2 -translate-x-1/2 rounded-medium bg-transparent px-4 py-2 text-[15px] text-gray-500">
          {bottomMessage}
        </div>
      )}
    </>
  );
}
