import {
  Box,
  Heading,
  HStack,
  Tag,
  Text,
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import { ICampaign } from "../types";
import { EditIcon, DeleteIcon, CopyIcon } from "@chakra-ui/icons";

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
  const state = getCampaignState(campaign);

  const showStart = state === "Ready";
  const showAttachCustomer = state === "Template";
  const showPause = state === "Executing";
  const showResume = state === "Paused";
  const showDelete = ["Ready", "Template", "Paused", "Ended"].includes(state!);
  const showEdit = ["Ready", "Template", "Paused"].includes(state!);
  const showDuplicate = true;

  return (
    <Box mb={4}>
      <Heading size="md" mb={2}>
        {campaign.name}
      </Heading>
      <HStack spacing={3} mb={2}>
        <Tag colorScheme="blue">State: {state}</Tag>
        {campaign.customerEmail && (
          <Tag colorScheme="green">{campaign.customerEmail}</Tag>
        )}
      </HStack>

      <ButtonGroup size="sm" spacing={2}>
        {showAttachCustomer && (
          <Button colorScheme="purple">Attach Customer</Button>
        )}
        {showStart && <Button colorScheme="green">Start</Button>}
        {showPause && <Button colorScheme="orange">Pause</Button>}
        {showResume && <Button colorScheme="green">Resume</Button>}
        {showEdit && (
          <Button leftIcon={<EditIcon />} colorScheme="blue" variant="outline">
            Edit
          </Button>
        )}
        {showDelete && (
          <Button leftIcon={<DeleteIcon />} colorScheme="red" variant="outline">
            Delete
          </Button>
        )}
        {showDuplicate && (
          <Button leftIcon={<CopyIcon />} colorScheme="info" variant="outline">
            Create Duplicate
          </Button>
        )}
      </ButtonGroup>
      {state === "Template" && (
        <Text fontSize="sm" mt={2} fontWeight={"normal"}>
          <sup>*</sup>Attach a customer to make it ready for execution
        </Text>
      )}
    </Box>
  );
};

export default CampaignMeta;
