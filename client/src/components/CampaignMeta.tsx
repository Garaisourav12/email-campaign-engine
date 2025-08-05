import {
  Box,
  Heading,
  HStack,
  Tag,
  Text,
  Button,
  ButtonGroup,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ICampaign } from "../types";
import { DeleteIcon } from "@chakra-ui/icons";
import AttachCustomerModal from "./AttachCustomerModal";
import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

interface Props {
  campaign: ICampaign;
}

const getCampaignState = (campaign: ICampaign) => {
  if (!campaign.customerEmail) {
    return "Template";
  } else if (campaign.state === "default") {
    return "Ready";
  } else if (campaign.state === "active") {
    return "Executing";
  } else if (campaign.state === "paused") {
    return "Paused";
  } else if (campaign.state === "ended") {
    return "Ended";
  }
};

const CampaignMeta = ({ campaign }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleting, setDeleting] = useState(false);
  const toast = useToast({ position: "top", duration: 3000, isClosable: true });
  const navigate = useNavigate();
  const state = getCampaignState(campaign);

  const showStart = state === "Ready";
  const showAttachCustomer = state === "Template";
  const showPause = state === "Executing";
  const showResume = state === "Paused";
  const showDelete = ["Ready", "Template", "Paused", "Ended"].includes(state!);
  // const showEdit = ["Ready", "Template", "Paused"].includes(state!);
  // const showDuplicate = true;

  const deleteCampaign = async () => {
    const cnf = window.confirm(
      "Are you sure you want to delete this campaign?"
    );
    if (!cnf) return;
    try {
      setDeleting(true);
      const response = await api.delete(`/campaigns/delete/${campaign._id}`);
      const data = response.data;
      if (data.success) {
        toast({
          title: "Campaign deleted successfully!",
          status: "success",
        });
        setTimeout(() => {
          navigate("/campaigns");
        }, 200);
      } else {
        toast({
          title: "Failed to delete campaign!",
          description: data.message || "Something went wrong",
          status: "error",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to delete campaign!",
        description: "Something went wrong. Please try again.",
        status: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Box mb={4}>
        <Heading size="md" mb={2}>
          {campaign.name}
        </Heading>
        <HStack spacing={3} mb={2}>
          <Tag colorScheme="blue">State: {state}</Tag>
          {campaign.customerEmail && (
            <Tag colorScheme="green">
              Customer Email: {campaign.customerEmail}
            </Tag>
          )}
        </HStack>

        <ButtonGroup size="sm" spacing={2}>
          {showAttachCustomer && (
            <Button colorScheme="purple" onClick={onOpen}>
              Attach Customer
            </Button>
          )}
          {showStart && <Button colorScheme="green">Start</Button>}
          {showPause && <Button colorScheme="orange">Pause</Button>}
          {showResume && <Button colorScheme="green">Resume</Button>}
          {/* {showEdit && (
          <Button leftIcon={<EditIcon />} colorScheme="blue" variant="outline">
            Edit
          </Button>
        )} */}
          {showDelete && (
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="red"
              variant="outline"
              isLoading={deleting}
              onClick={deleteCampaign}
            >
              Delete
            </Button>
          )}
          {/* {showDuplicate && (
          <Button leftIcon={<CopyIcon />} colorScheme="info" variant="outline">
            Create Duplicate
          </Button>
        )} */}
        </ButtonGroup>
        {state === "Template" && (
          <Text fontSize="sm" mt={2} fontWeight={"normal"}>
            <sup>*</sup>Attach a customer to make it ready for execution
          </Text>
        )}
      </Box>
      {isOpen && (
        <AttachCustomerModal
          isOpen={isOpen}
          onClose={onClose}
          campaign={campaign}
        />
      )}
    </>
  );
};

export default CampaignMeta;
