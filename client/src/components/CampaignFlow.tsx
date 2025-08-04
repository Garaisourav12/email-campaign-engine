import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { transformCampaignToFlow } from "../utils/transformCampaignToFlow";
import { ICampaignNode, ICampaign } from "../types";
import CustomNode from "./CustomNode";

type Props = {
  campaign: ICampaign;
  onNodeClick: (node: ICampaignNode) => void;
};

const CampaignFlow: React.FC<Props> = ({ campaign }) => {
  const { nodes, edges } = transformCampaignToFlow(campaign);

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ customNode: CustomNode }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CampaignFlow;
