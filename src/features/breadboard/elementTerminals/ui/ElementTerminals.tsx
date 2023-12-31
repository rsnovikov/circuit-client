import { FC, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/model';
import { ITerminal } from '@/shared/model/types';
import { endWireToElementAction } from '../model/endWireToElementAction';
import { startWireFromElementAction } from '../model/startWireFromElementAction';

interface IElementTerminalsProps {
  terminals: ITerminal[];
  elementId: string;
}

export const ElementTerminals: FC<IElementTerminalsProps> = ({ terminals, elementId }) => {
  const drawingWire = useAppSelector((state) => state.wire.drawingWire);
  const dispatch = useAppDispatch();

  const handleTerminalClick = (e: MouseEvent, terminalId: string) => {
    // todo: maybe remove stopPropagation and add check to the handleSvgClick in widget Breadboard
    e.stopPropagation();
    if (drawingWire) {
      dispatch(endWireToElementAction({ terminalId, elementId }));
    } else {
      dispatch(
        startWireFromElementAction({
          terminalId,
          elementId,
        })
      );
    }
  };

  return terminals.map(({ id: terminalId, x, y }) => (
    <rect
      onClick={(e) => handleTerminalClick(e, terminalId)}
      key={terminalId}
      transform={`translate(${x}, ${y})`}
      x="-4"
      y="-4"
      width="8"
      height="8"
      strokeWidth="0"
      className="hover:stroke-2 hover:fill-[red]"
    />
  ));
};
