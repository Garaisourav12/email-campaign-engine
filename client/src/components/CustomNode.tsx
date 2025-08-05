import React from "react";
import { Box, Tag, Text, HStack, VStack, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Handle, Position, NodeProps } from "reactflow";
import { ICampaignNode } from "../types";

type Props = {
  node: ICampaignNode;
  isActive: boolean;
  isVisited: boolean;
  isUnreachable: boolean;
  campaignState: "default" | "active" | "paused" | "ended";
};

const CustomNode: React.FC<
  NodeProps<Props> & {
    onEdit: (node: ICampaignNode) => void;
  }
> = ({ data, sourcePosition, targetPosition, onEdit }) => {
  const { node, isActive, isVisited, isUnreachable, campaignState } = data;

  const getColor = () => {
    if (isActive) return "green.300";
    if (isVisited) return "blue.200";
    return "white";
  };

  const isEditable = campaignState === "default" || !isUnreachable;

  return (
    <Box
      p={3}
      bg={getColor()}
      border="1px solid"
      borderColor={isActive ? "green.600" : isVisited ? "blue.600" : "gray.500"}
      borderRadius="md"
      minW="180px"
      boxShadow="md"
      position="relative"
    >
      {/* Handle for incoming edges */}
      {node.type !== "Start" && (
        <Handle type="target" position={targetPosition || Position.Left} />
      )}

      <VStack align="start" spacing={2}>
        <HStack justify="space-between" width="100%">
          <Tag size="sm" colorScheme="purple">
            {node.type} ({node.id})
          </Tag>
          {node.type !== "Start" && (
            <HStack spacing={1}>
              {node.type === "End" && (
                <IconButton
                  size="xs"
                  icon={<EditIcon />}
                  aria-label="Edit"
                  variant="ghost"
                  isDisabled={!isEditable}
                  onClick={() => onEdit(node)}
                />
              )}
              {node.type !== "End" && (
                <IconButton
                  size="xs"
                  icon={<DeleteIcon />}
                  aria-label="Delete"
                  variant="ghost"
                  colorScheme="red"
                  isDisabled={!isEditable}
                />
              )}
            </HStack>
          )}
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
      {node.type !== "End" && (
        <Handle type="source" position={sourcePosition || Position.Right} />
      )}
    </Box>
  );
};

export default CustomNode;
