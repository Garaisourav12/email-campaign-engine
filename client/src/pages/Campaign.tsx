// pages/Campaign.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CampaignMeta from "../components/CampaignMeta";
import CampaignFlow from "../components/CampaignFlow";
import { Box, useToast } from "@chakra-ui/react";
import { ICampaignNode } from "../types";
import EntityNotFound from "../components/EntityNotFound";
import api from "../utils/api";
import PageLoader from "../components/PageLoader";
import ContentWrapper from "../components/ContentWrapper";
import { useGlobalContext } from "../context";
import { getSocket } from "../utils/socket";

const Campaign = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { socketId } = useGlobalContext();

  const handleNodeClick = (node: ICampaignNode) => {
    toast({
      title: `Node: ${node.type}`,
      description: `Node ID: ${node.id}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/campaigns/${id}`);
        const data = response.data;
        if (data.success) {
          setCampaign(data.data);
        } else {
          setCampaign(null);
        }
      } catch (error) {
        setCampaign(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  useEffect(() => {
    if (socketId) {
      const socket = getSocket();
      if (socket) {
        console.log("socketId", socket.id);
        socket.on("updateCampaign", (data) => {
          console.log("updateCampaign", data);
          if (data.id === id) {
            setCampaign(data);
          }
        });
      }
    }
  }, [socketId]);

  if (loading) {
    return <PageLoader />;
  }

  if (!campaign) {
    return (
      <EntityNotFound message="The campaign you're looking for does not exist or has been removed." />
    );
  }

  return (
    <ContentWrapper>
      <Box py={4}>
        <CampaignMeta campaign={campaign} />
        <CampaignFlow
          campaign={campaign}
          setCampaign={setCampaign as any}
          onNodeClick={handleNodeClick}
        />
      </Box>
    </ContentWrapper>
  );
};

export default Campaign;
