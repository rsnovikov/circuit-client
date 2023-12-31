import { FC } from 'react';
import { NodeCirElement } from '@/entities/node';
import { useDragNode } from '@/features/node/dragNode/model/useDragNode';
import { NodeTerminal } from '@/features/node/nodeTerminal/ui/NodeTerminal';
import { useSelectNode } from '@/features/node/selectNode/model/useSelectNode';
import { useAppSelector } from '@/shared/model';

export const BreadboardNodes: FC = () => {
  const nodes = useAppSelector((state) => state.node.nodes);
  const selectedNodeId = useAppSelector((state) => state.node.selectedNodeId);

  const { startDragNode, endDragNode } = useDragNode();
  const { selectNode } = useSelectNode();

  return nodes.map((node) =>
    !node.relatedElement ? (
      <NodeCirElement
        key={node.id}
        node={node}
        selectedNodeId={selectedNodeId}
        onMouseDown={({ clientX, clientY }) => {
          startDragNode({ clientX, clientY, nodeId: node.id });
          selectNode({ nodeId: node.id });
        }}
        onMouseUp={() => endDragNode()}
      >
        <NodeTerminal nodeId={node.id} />
      </NodeCirElement>
    ) : null
  );
};
