// pages/Campaign.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CampaignMeta from "../components/CampaignMeta";
import CampaignFlow from "../components/CampaignFlow";
import { Box, useToast } from "@chakra-ui/react";
import { ICampaignNode } from "../types";
import { dummyCampaign } from "../utils/common";

const Campaign = () => {
  const { id } = useParams();
  const [campaign] = useState(dummyCampaign);
  const toast = useToast();

  const handleNodeClick = (node: ICampaignNode) => {
    toast({
      title: `Node: ${node.type}`,
      description: `Node ID: ${node.id}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <CampaignMeta campaign={campaign} />
      <CampaignFlow campaign={campaign} onNodeClick={handleNodeClick} />
    </Box>
  );
};

export default Campaign;
