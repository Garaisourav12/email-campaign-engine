import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { transformCampaignToFlow } from "../utils/transformCampaignToFlow";
import { ICampaignNode, ICampaign } from "../types";
import CustomNode from "./CustomNode";
import { Box, useDisclosure } from "@chakra-ui/react";
import NodeEditModal from "./NodeEditModal";

type Props = {
  campaign: ICampaign;
  setCampaign: (campaign: ICampaign) => void;
  onNodeClick: (node: ICampaignNode) => void;
};

const CampaignFlow: React.FC<Props> = ({ campaign, setCampaign }) => {
  const { nodes, edges } = transformCampaignToFlow(campaign);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingNode, setEditingNode] = React.useState<ICampaignNode | null>(
    null
  );

  return (
    <>
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
          nodeTypes={{
            customNode: (props) => (
              <CustomNode
                {...props}
                onEdit={(node) => {
                  setEditingNode(node);
                  onOpen();
                }}
              />
            ),
          }}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Box>
      {isOpen && editingNode && (
        <NodeEditModal
          isOpen={isOpen}
          onClose={onClose}
          node={editingNode}
          campaign={campaign}
          setCampaign={setCampaign}
        />
      )}
    </>
  );
};

export default CampaignFlow;
