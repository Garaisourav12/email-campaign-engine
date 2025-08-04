import React from "react";
import { Box, Tag, Text, HStack, VStack, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Handle, Position, NodeProps } from "reactflow";
import { ICampaignNode } from "../types";

type Props = {
  node: ICampaignNode;
  isActive: boolean;
  isVisible: boolean;
  isUnreachable: boolean;
  campaignState: "default" | "active" | "paused" | "ended";
};

const CustomNode: React.FC<NodeProps<Props>> = ({ data }) => {
  const { node, isActive, isVisible, isUnreachable, campaignState } = data;

  const getColor = () => {
    if (isActive) return "green.400";
    if (isVisible) return "blue.300";
    return "gray.200";
  };

  const isEditable = campaignState === "default" || !isUnreachable;

  return (
    <Box
      p={3}
      bg={getColor()}
      border="2px solid"
      borderColor={isActive ? "green.600" : isVisible ? "blue.500" : "gray.300"}
      borderRadius="md"
      minW="180px"
      boxShadow="md"
      position="relative"
    >
      {/* Handle for incoming edges */}
      <Handle type="target" position={Position.Left} />

      <VStack align="start" spacing={2}>
        <HStack justify="space-between" width="100%">
          <Tag size="sm" colorScheme="purple">
            {node.type}
          </Tag>
          <HStack spacing={1}>
            <IconButton
              size="xs"
              icon={<EditIcon />}
              aria-label="Edit"
              variant="ghost"
              isDisabled={!isEditable}
            />
            <IconButton
              size="xs"
              icon={<DeleteIcon />}
              aria-label="Delete"
              variant="ghost"
              colorScheme="red"
              isDisabled={!isEditable}
            />
          </HStack>
        </HStack>

        {node.type === "SendEmail" && (
          <Text fontSize="sm">📧 Template: {node.emailTemplateId}</Text>
        )}

        {node.type === "Wait" && (
          <Text fontSize="sm">⏳ Duration: {node.duration}</Text>
        )}

        {node.type === "Condition" && (
          <Text fontSize="sm">🔀 Branches: {node.branches?.length}</Text>
        )}
      </VStack>

      {/* Handle for outgoing edges */}
      <Handle type="source" position={Position.Right} />
    </Box>
  );
};

export default CustomNode;
