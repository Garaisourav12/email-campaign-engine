// components/CampaignMeta.tsx
import { Box, Heading, HStack, Tag, Text } from "@chakra-ui/react";
import { ICampaign } from "../types";

interface Props {
  campaign: ICampaign;
}

const CampaignMeta = ({ campaign }: Props) => {
  return (
    <Box mb={4}>
      <Heading size="md" mb={2}>
        {campaign.name}
      </Heading>
      <HStack spacing={3}>
        <Tag colorScheme="blue">{campaign.state}</Tag>
        {campaign.customerEmail && (
          <Tag colorScheme="green">{campaign.customerEmail}</Tag>
        )}
        <Tag colorScheme="purple">Visited: {campaign.visitedNodes.length}</Tag>
        <Tag colorScheme="orange">Nodes: {campaign.nodes.length}</Tag>
      </HStack>
    </Box>
  );
};

export default CampaignMeta;
