import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Eraser, Trash2, Paintbrush } from 'lucide-react';
import type { HubCanvasStroke } from '../../sync/hubSync';

export interface DrawingCanvasHandle {
  drawStroke: (stroke: HubCanvasStroke) => void;
  drawStrokes: (strokes: HubCanvasStroke[]) => void;
  clear: () => void;
}

interface DrawingCanvasProps {
  isReadOnly?: boolean;
  onStroke?: (stroke: HubCanvasStroke) => void;
  onClear?: () => void;
  className?: string;
  backgroundColor?: string;
}

const PALETTE = [
  '#000000', // Black
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow/Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#ffffff', // White
];

const STROKE_SIZES = [2, 4, 8, 16];

export const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(
  (
    {
      isReadOnly = false,
      onStroke,
      onClear,
      className = '',
      backgroundColor = '#ffffff',
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState(PALETTE[0]);
    const [currentSize, setCurrentSize] = useState(4);
    const [isEraser, setIsEraser] = useState(false);
    const lastPointRef = useRef<{ x: number; y: number } | null>(null);

    // Provide imperative handle to parent (for TV mirror rendering)
    useImperativeHandle(ref, () => ({
      drawStroke: (stroke: HubCanvasStroke) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Coordinates are received as percentages (0..1) so it scales across different TV resolutions
        const w = canvas.width;
        const h = canvas.height;

        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(stroke.x0 * w, stroke.y0 * h);
        ctx.lineTo(stroke.x1 * w, stroke.y1 * h);
        ctx.stroke();
      },
      drawStrokes: (strokes: HubCanvasStroke[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const w = canvas.width;
        const h = canvas.height;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (const stroke of strokes) {
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.size;
          ctx.beginPath();
          ctx.moveTo(stroke.x0 * w, stroke.y0 * h);
          ctx.lineTo(stroke.x1 * w, stroke.y1 * h);
          ctx.stroke();
        }
      },
      clear: () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
    }));

    // Auto-resize canvas buffer to match its displayed bounding client rect
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          canvas.width = rect.width;
          canvas.height = rect.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      };

      resize();
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }, [backgroundColor]);

    const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0, ratioX: 0, ratioY: 0 };
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return {
        x,
        y,
        ratioX: x / rect.width,
        ratioY: y / rect.height,
      };
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isReadOnly) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const coords = getCanvasCoords(e);
      lastPointRef.current = { x: coords.ratioX, y: coords.ratioY };
      setIsDrawing(true);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing || isReadOnly || !lastPointRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const coords = getCanvasCoords(e);
      const prev = lastPointRef.current;

      const color = isEraser ? backgroundColor : currentColor;
      const size = isEraser ? currentSize * 2 : currentSize;

      // Draw locally on canvas
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(prev.x * canvas.width, prev.y * canvas.height);
      ctx.lineTo(coords.ratioX * canvas.width, coords.ratioY * canvas.height);
      ctx.stroke();

      // Emit stroke in ratio coordinates so TV display renders precisely
      const strokeData: HubCanvasStroke = {
        x0: prev.x,
        y0: prev.y,
        x1: coords.ratioX,
        y1: coords.ratioY,
        color,
        size,
      };
      onStroke?.(strokeData);

      lastPointRef.current = { x: coords.ratioX, y: coords.ratioY };
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (isReadOnly) return;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsDrawing(false);
      lastPointRef.current = null;
    };

    const handleClear = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onClear?.();
    };

    return (
      <div className={`flex flex-col gap-2.5 w-full h-full ${className}`}>
        {/* Host Toolbar (Hidden on TV Read-Only mode) */}
        {!isReadOnly && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            {/* Palette */}
            <div className="flex items-center gap-1.5">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrentColor(c);
                    setIsEraser(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    currentColor === c && !isEraser
                      ? 'scale-125 border-blue-400 shadow-md ring-2 ring-blue-500/50'
                      : 'border-slate-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  title={`Color ${c}`}
                />
              ))}
            </div>

            {/* Stroke sizes */}
            <div className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-slate-400" />
              {STROKE_SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setCurrentSize(sz)}
                  className={`px-2 py-1 rounded-lg font-bold ${
                    currentSize === sz && !isEraser
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>

            {/* Eraser & Clear */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEraser((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                  isEraser
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Eraser className="w-4 h-4" />
                Eraser
              </button>

              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors"
                title="Clear entire canvas"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Canvas Element */}
        <div className="flex-1 w-full min-h-[350px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner bg-white">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`w-full h-full block ${isReadOnly ? 'cursor-default' : 'cursor-crosshair touch-none'}`}
          />
        </div>
      </div>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
