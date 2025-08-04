import { Node, Edge, Position } from "reactflow";
import { ICampaign, IRootNode } from "../types";

export function transformCampaignToFlow(campaign: ICampaign): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodeMap = new Map<string, any>();
  campaign.nodes.forEach((node) => nodeMap.set(node.id, node));

  const levelYMap = new Map<number, number[]>();
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  campaign.nodes.forEach((node) => {
    const y = node.level * 150;
    const xList = levelYMap.get(node.level) || [];
    const x = xList.length * 250;
    xList.push(x);
    levelYMap.set(node.level, xList);

    // Create Node
    nodes.push({
      id: node.id,
      type: "customNode",
      data: {
        node,
        isActive: node.type !== "Start" && node.id === campaign.currentNodeId,
        isVisited:
          node.type === "Start" || campaign.visitedNodes.includes(node.id),
        isUnreachable:
          node.type === "Start" || campaign.unreachableNodes.includes(node.id),
        campaignState: campaign.state,
      },
      position: { x, y },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {},
    });

    // Create Edges
    if (node.type === "Condition") {
      node?.branches?.forEach?.((branch, i) => {
        if (branch.next) {
          const visited = campaign.visitedNodes
            .join("-")
            .includes(`${node.id}-${branch.next}`);
          edges.push({
            id: `${node.id}-${branch.next}-${branch.event}`,
            source: node.id,
            target: branch.next,
            label: branch.event,
            animated: true,
            style: {
              stroke: visited ? "#417ef9ff" : "gray.400",
              strokeWidth: 2,
            },
          });
        }
      });
    } else if (node.type !== "End") {
      const visited = campaign.visitedNodes
        .join("-")
        .includes(`${node.id}-${node.next}`);
      edges.push({
        id: `${node.id}-${node.next}`,
        source: node.id,
        target: node.next,
        animated: true,
        style: { stroke: visited ? "#417ef9ff" : "gray.400", strokeWidth: 2 },
      });
    }
  });

  return { nodes, edges };
}
