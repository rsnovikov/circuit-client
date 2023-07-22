import { FC, MouseEventHandler, useEffect, useRef, useState } from 'react';
import {
  addNodeAndConfirmWire,
  confirmPickedElement,
  removeDrawingWire,
  removeSelectedElementId,
  updateDraggableElement,
  updateDrawingWireCoords,
  updatePickedElementCoords,
  updateScale,
  updateTranslateCoords,
} from '@/entities/breadboard/model/slice';
import { BreadboardCirElement } from '@/entities/breadboard/ui/BreadboardCirElement';
import { NodeElement } from '@/entities/node';
import { Wire } from '@/entities/wire';
import { useDragElement } from '@/features/dragElement';
import { useKeyDown } from '@/shared/lib/useKeyDown';
import { useAppDispatch, useAppSelector } from '@/shared/model';
import { getMousePosition } from '../lib/getMouseCoords';

export const Breadboard: FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useAppDispatch();
  const {
    pickedElement,
    elements,
    draggableElement,
    selectedElementId,
    scale,
    translateCoords: { translateX, translateY },
    drawingWire,
    wires,
    nodes,
  } = useAppSelector((state) => state.breadboard);
  const [isBreadboardMove, setIsBreadboardMove] = useState<boolean>(false);

  // todo: try move listeners and dispatch to features
  useEffect(() => {
    svgRef.current?.addEventListener('wheel', handleSvgWheel);

    return () => {
      svgRef.current?.removeEventListener('wheel', handleSvgWheel);
    };
  }, []);

  const handleSvgMouseMove: MouseEventHandler = (e) => {
    const { clientX, clientY, movementX, movementY } = e;

    const coords = getMousePosition({ x: clientX, y: clientY }, svgRef.current?.getScreenCTM());
    if (!coords) return;
    if (draggableElement) {
      dispatch(updateDraggableElement({ x: clientX, y: clientY }));
    } else if (pickedElement) {
      dispatch(updatePickedElementCoords(coords));
    } else if (isBreadboardMove) {
      dispatch(updateTranslateCoords({ deltaX: movementX, deltaY: movementY }));
    } else if (drawingWire) {
      dispatch(updateDrawingWireCoords(coords));
    }
  };

  const handleSvgMouseDown: MouseEventHandler = () => {
    setIsBreadboardMove(true);
  };

  const handleSvgMouseUp: MouseEventHandler = () => {
    setIsBreadboardMove(false);
  };

  const handleSvgClick: MouseEventHandler<SVGElement> = (e) => {
    // todo: add else?
    const { clientX, clientY } = e;
    if (pickedElement) {
      dispatch(confirmPickedElement());
    }
    if (selectedElementId && e.target === e.currentTarget) {
      dispatch(removeSelectedElementId());
    }
    if (drawingWire) {
      const coords = getMousePosition({ x: clientX, y: clientY }, svgRef.current?.getScreenCTM());
      if (!coords) return;
      dispatch(addNodeAndConfirmWire(coords));
    }
  };

  const handleSvgWheel: (e: WheelEvent) => void = (e: WheelEvent) => {
    e.preventDefault();
    const { deltaX, deltaY, clientX, clientY } = e;
    const coords = getMousePosition({ x: clientX, y: clientY }, svgRef.current?.getScreenCTM());
    if (!coords) return;
    const delta = deltaY || deltaX;
    const scaleStep = -(delta / 100);
    dispatch(updateScale(scaleStep, coords));
  };

  // todo: maybe move logic to feature
  const handleKeyDownRemoveSelected = () => {
    dispatch(removeSelectedElementId());
    dispatch(removeDrawingWire());
  };
  useKeyDown(handleKeyDownRemoveSelected, ['Escape']);
  const { handleMouseDown: handleElementMouseDown, handleMouseUp: handleElementMouseUp } =
    useDragElement();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      className="absolute inset-0 bg-[#f4f5f6]"
      onMouseMove={handleSvgMouseMove}
      onClick={handleSvgClick}
      ref={svgRef}
      onMouseDown={handleSvgMouseDown}
      onMouseUp={handleSvgMouseUp}
    >
      <g transform={`matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`}>
        {drawingWire && <Wire wire={drawingWire} />}
        {wires.map((wire) => (
          <Wire key={wire.id} wire={wire} />
        ))}
        {elements.map((element) => (
          <BreadboardCirElement
            key={element.id}
            element={element}
            onMouseDown={(e) => handleElementMouseDown(e, element.id)}
            onMouseUp={(e) => handleElementMouseUp(e, element.id)}
          />
        ))}
        {nodes.map((node) =>
          !node.relatedElement ? <NodeElement key={node.id} node={node} /> : null
        )}
        {/* todo: add special component without terminals for picked element */}
        {pickedElement && <BreadboardCirElement element={pickedElement} />}
      </g>
    </svg>
  );
};
