import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { transformCampaignToFlow } from "../utils/transformCampaignToFlow";
import { ICampaignNode, ICampaign } from "../types";
import CustomNode from "./CustomNode";
import { Box } from "@chakra-ui/react";

type Props = {
  campaign: ICampaign;
  onNodeClick: (node: ICampaignNode) => void;
};

const CampaignFlow: React.FC<Props> = ({ campaign }) => {
  const { nodes, edges } = transformCampaignToFlow(campaign);

  return (
    <Box
      w={"full"}
      h={"400px"}
      border={"1px solid"}
      borderColor={"gray.400"}
      borderRadius={"md"}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ customNode: CustomNode }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default CampaignFlow;
