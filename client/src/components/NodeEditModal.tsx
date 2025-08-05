import React, { useEffect, useState } from "react";
import {
  Input,
  Select,
  Button,
  Checkbox,
  VStack,
  useToast,
} from "@chakra-ui/react";
import ModalWrapper from "./ModalWrapper"; // Your reusable modal
import { ICampaign, ICampaignNode } from "../types"; // Adjust import paths
import api from "../utils/api";

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: ICampaignNode;
  campaign: ICampaign;
  setCampaign: (campaign: ICampaign) => void;
}

const typeOptions = [
  { value: "SendEmail", label: "Send Email" },
  { value: "Wait", label: "Wait" },
  { value: "Condition", label: "Condition" },
];

const NodeEditModal: React.FC<NodeEditModalProps> = ({
  isOpen,
  onClose,
  node,
  campaign,
  setCampaign,
}) => {
  const [editedNode, setEditedNode] = useState<ICampaignNode>(node);
  const [emailTemplates, setEmailTemplates] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast({ position: "top", duration: 3000, isClosable: true });

  useEffect(() => {
    const getEmailTemplates = async () => {
      try {
        const response = await api.get("/getEmailTemplates");
        if (response.data.success) {
          console.log(response.data.data);

          setEmailTemplates(response.data.data);
        } else {
          setEmailTemplates([]);
        }
      } catch (error) {
        // handle error
        setEmailTemplates([]);
      }
    };
    getEmailTemplates();
  }, []);

  useEffect(() => {
    setEditedNode(node);
  }, [node]);

  if (editedNode.type === "Start") return null;

  const handleChange = (field: string, value: any) => {
    setEditedNode((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let payload: ICampaignNode;
      if (editedNode.type === "SendEmail") {
        payload = {
          id: editedNode.id,
          type: editedNode.type,
          level: editedNode.level,
          emailTemplateId: editedNode.emailTemplateId,
          events: editedNode.events,
          branches: [],
          next: editedNode.next,
        };
      } else if (editedNode.type === "Wait") {
        payload = {
          id: editedNode.id,
          type: editedNode.type,
          level: editedNode.level,
          duration: editedNode.duration,
          events: [],
          branches: [],
          next: editedNode.next,
        };
      } else if (editedNode.type === "Condition") {
        payload = {
          id: editedNode.id,
          type: editedNode.type,
          level: editedNode.level,
          dependentOn: editedNode.dependentOn,
          hasRemainder: editedNode.hasRemainder,
          events: [],
          branches: [],
        };
      }

      const response = await api.put(`/campaigns/update/${campaign._id}`, {
        ...campaign,
        nodes: campaign.nodes.map((n: any) =>
          n.id === editedNode.id ? payload : n
        ),
      });
      const data = response.data;

      if (data.success) {
        console.log(data.data);
        setCampaign(data.data);
        toast({
          title: "Node updated successfully!",
          status: "success",
        });
      } else {
        toast({
          title: "Failed to update node",
          description: data.message || "Something went wrong",
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update node",
        description: "Something went wrong. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }

    onClose();
  };

  const renderFields = () => {
    switch (editedNode.type) {
      case "SendEmail":
        return (
          <>
            <Select
              placeholder="Select Email Template"
              value={editedNode.emailTemplateId}
              onChange={(e) => {
                handleChange("emailTemplateId", e.target.value);
                // Update events array
                handleChange(
                  "events",
                  emailTemplates
                    .find((template: any) => template.id === e.target.value)
                    .events.map((event: any) => {
                      return {
                        name: event,
                        state: "pending",
                      };
                    })
                );
              }}
            >
              {emailTemplates.map((template: any) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Select>
          </>
        );
      case "Wait":
        return (
          <>
            <Input
              placeholder="Duration (e.g., 5d, 2h)"
              value={(editedNode as any).duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </>
        );
      case "Condition":
        return (
          <>
            <Input
              placeholder="Dependent On (e.g., n1, n2)"
              value={(editedNode as any).dependentOn}
              onChange={(e) => handleChange("dependentOn", e.target.value)}
            />
            <Checkbox
              alignSelf={"flex-start"}
              isChecked={(editedNode as any).hasRemainder}
              onChange={(e) => handleChange("hasRemainder", e.target.checked)}
              mt={2}
            >
              Has Remainder Branch
            </Checkbox>
          </>
        );
      case "End":
        return null;
      default:
        return null;
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Node (${editedNode.type})`}
      footer={
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          Save Changes
        </Button>
      }
    >
      <VStack spacing={4}>
        <Select
          value={editedNode.type === "End" ? "" : editedNode.type}
          onChange={(e) => {
            if (e.target.value === "") return;
            handleChange("type", e.target.value);
          }}
          placeholder="Select Node Type"
          required
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        {renderFields()}
      </VStack>
    </ModalWrapper>
  );
};

export default NodeEditModal;
