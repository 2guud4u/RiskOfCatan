import { useCallback, useEffect, useRef, useState } from 'react';
import { MAX_ZOOM, MIN_ZOOM, PAN_THRESHOLD, ZOOM_STEP } from '../constants';

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Pan/zoom for the board SVG. The viewBox is expressed in board coordinates, so
 * zooming and panning are just moving a window over that space: zoom resizes
 * the window (center-anchored) and panning shifts its center. Attach the
 * returned `onMouseDown` / `onWheel` / `onDoubleClick` to the `<svg>` element.
 *
 * Panning is a left-button drag on empty board space. Vertices, edges, and
 * soldier badges all stopPropagation on mousedown, so they keep their own
 * click/drag behavior and do not start a pan. Double-click zooms in;
 * Shift+double-click (or the reset button) restores the fit view.
 */
export function useBoardViewport(svgRef: React.RefObject<SVGSVGElement>, baseSize: number) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const panRef = useRef<{ startX: number; startY: number; originX: number; originY: number; active: boolean } | null>(null);

  // Keep the latest zoom readable from the (once-registered) move listener.
  const zoomRef = useRef(1);
  zoomRef.current = zoom;

  const half = baseSize / 2;

  /** Screen pixels per board unit at the current zoom. */
  const pxPerBoard = () => {
    const rect = svgRef.current?.getBoundingClientRect();
    return rect && rect.width > 0 ? rect.width / ((2 * half) / zoomRef.current) : 1;
  };

  const zoomBy = useCallback((factor: number) => {
    setZoom((z) => clamp(z * factor, MIN_ZOOM, MAX_ZOOM));
  }, []);

  const reset = useCallback(() => {
    setZoom(1);
    setCenter({ x: 0, y: 0 });
  }, []);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.shiftKey) reset();
      else zoomBy(ZOOM_STEP);
    },
    [reset, zoomBy]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      panRef.current = { startX: e.clientX, startY: e.clientY, originX: center.x, originY: center.y, active: false };
    },
    [center]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const pan = panRef.current;
      if (!pan) return;
      if (!pan.active) {
        if (Math.hypot(e.clientX - pan.startX, e.clientY - pan.startY) < PAN_THRESHOLD) return;
        pan.active = true;
      }
      const scale = pxPerBoard();
      setCenter({
        x: pan.originX - (e.clientX - pan.startX) / scale,
        y: pan.originY - (e.clientY - pan.startY) / scale,
      });
    };
    const onUp = () => {
      panRef.current = null;
    };
    // Native non-passive wheel listener: React attaches `wheel` passively at the
    // root, so a synthetic handler's preventDefault() is ignored and the browser
    // also zooms/scrolls the page (the "double zoom"). A non-passive listener
    // can preventDefault(), so wheeling over the board zooms only the board.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
    };
    const svg = svgRef.current;
    if (svg) svg.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      if (svg) svg.removeEventListener('wheel', onWheel);
    };
    // pxPerBoard reads zoomRef (always current); zoomBy is a stable callback.
    // Re-runs only if the svg element or base size changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef, half, zoomBy]);

  return {
    zoom,
    reset,
    isDirty: zoom !== 1 || center.x !== 0 || center.y !== 0,
    viewBox: `${center.x - half / zoom} ${center.y - half / zoom} ${(2 * half) / zoom} ${(2 * half) / zoom}`,
    onDoubleClick,
    onMouseDown,
  };
}
