import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import ModalWrapper from "./ModalWrapper";
import { ICampaign } from "../types";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  campaign: ICampaign;
}

const AttachCustomerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  campaign,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast({ position: "top", duration: 3000, isClosable: true });
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Email is required",
        status: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/campaigns/create", {
        name: `${campaign.name} - ${email}`,
        customerEmail: email,
        nodes: campaign.nodes,
      });

      const data = response.data;

      if (data.success) {
        toast({
          title: `Customer email attached to campaign ${campaign.name}`,
          status: "success",
        });
        onClose();
        setTimeout(() => {
          navigate(`/campaign/${data.data._id}`);
        }, 200);
      } else {
        toast({
          title: "Failed to attach customer email to campaign",
          description: data.message || "Something went wrong",
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to attach customer email to campaign",
        description: "Something went wrong. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Attach Customer Email"
      footer={
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
          Attach
        </Button>
      }
    >
      <FormControl>
        <FormLabel>Customer Email</FormLabel>
        <Input
          type="email"
          placeholder="customer@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <Text mt={4}>
        After attaching customer email, it will create a new executable
        campaign.
      </Text>
    </ModalWrapper>
  );
};

export default AttachCustomerModal;
