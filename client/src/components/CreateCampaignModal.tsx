import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import ModalWrapper from "./ModalWrapper"; // assuming it's in the same folder
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast({ position: "top", duration: 3000, isClosable: true });
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await api.post("/campaigns/create", { name: name.trim() });

      const data = res.data;

      if (data.success) {
        toast({
          title: "Campaign created",
          status: "success",
        });
        onClose();
        setTimeout(() => {
          navigate(`/campaign/${data.data._id}`);
        }, 200);
      } else {
        toast({
          title: "Campaign creation failed!",
          description: data.message || "Something went wrong",
          status: "error",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
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
      title="Create Campaign"
      footer={
        <Button
          colorScheme="blue"
          onClick={handleCreate}
          isDisabled={!name.trim()}
          isLoading={loading}
        >
          Create
        </Button>
      }
    >
      <FormControl>
        <FormLabel>Campaign Name</FormLabel>
        <Input
          placeholder="Enter campaign name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
    </ModalWrapper>
  );
};

export default CreateCampaignModal;
