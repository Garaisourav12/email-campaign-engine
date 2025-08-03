// components/CampaignFlow.tsx
import React from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  MiniMap,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { ICampaign, CampaignNode } from "../types";

interface Props {
  campaign: ICampaign;
  onNodeClick: (node: CampaignNode) => void;
}

const CampaignFlow: React.FC<Props> = ({ campaign, onNodeClick }) => {
  const getNodeColor = (nodeId: string) =>
    campaign.visitedNodes.includes(nodeId) ? "#2b6cb0" : "#CBD5E0";

  const nodes: Node[] = campaign.nodes.map((node) => ({
    id: node.id,
    data: { label: `${node.type} (${node.id})` },
    position: { x: node.level * 150, y: node.level * 80 },
    style: {
      background: getNodeColor(node.id),
      color: "white",
      padding: 10,
      borderRadius: 8,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: false,
    type: "default",
  }));

  const edges: Edge[] = [];

  campaign.nodes.forEach((node) => {
    if (node.type === "SendEmail" || node.type === "Wait") {
      edges.push({
        id: `e-${node.id}-${node.next}`,
        source: node.id,
        target: node.next,
        animated: campaign.visitedNodes.includes(node.id),
        style: {
          stroke: campaign.visitedNodes.includes(node.id)
            ? "#2b6cb0"
            : "#A0AEC0",
        },
      });
    } else if (node.type === "Condition") {
      node.branches.forEach((branch) => {
        edges.push({
          id: `e-${node.id}-${branch.next}`,
          source: node.id,
          target: branch.next,
          label: branch.event,
          animated: campaign.visitedNodes.includes(node.id),
          style: {
            stroke: campaign.visitedNodes.includes(node.id)
              ? "#2b6cb0"
              : "#A0AEC0",
          },
        });
      });
    }
  });

  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [flowEdges, , onEdgesChange] = useEdgesState(edges);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => {
          const found = campaign.nodes.find((n) => n.id === node.id);
          if (found) onNodeClick(found);
        }}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default CampaignFlow;
