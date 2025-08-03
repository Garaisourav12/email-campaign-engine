import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VStack,
  SimpleGrid,
  useToast,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { AddIcon, EmailIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

type CampaignStatus =
  | "template"
  | "campaign"
  | "executable"
  | "ended"
  | "paused"
  | "active";

type Campaign = {
  id: number;
  name: string;
  description: string;
  status: CampaignStatus;
};

const TABS: { label: string; value: CampaignStatus }[] = [
  { label: "Template", value: "template" },
  { label: "Campaign", value: "campaign" },
  { label: "Executable", value: "executable" },
  { label: "Ended", value: "ended" },
  { label: "Paused", value: "paused" },
  { label: "Active", value: "active" },
];

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setLoading(true);

    // Simulated data fetch
    setTimeout(() => {
      const fetchedCampaigns: Campaign[] = [
        {
          id: 1,
          name: "New Year Blast",
          description: "Promo campaign for New Year.",
          status: "active",
        },
        {
          id: 2,
          name: "Winter Template",
          description: "Reusable template for winter offers.",
          status: "template",
        },
        {
          id: 3,
          name: "Paused Sale",
          description: "Paused mid-way due to issues.",
          status: "paused",
        },
      ];

      setCampaigns(fetchedCampaigns);
      setLoading(false);
    }, 1500);
  }, []);

  const handleCreateCampaign = () => {
    toast({
      title: "Redirecting to create campaign...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
    navigate("/campaigns/create");
  };

  const currentTab = TABS[selectedTab].value;
  const filteredCampaigns = campaigns.filter((c) => c.status === currentTab);

  return (
    <Box bg="gray.50" flex={1} minH={"fit-content"} p={8}>
      <Heading mb={6} color="blue.700">
        {} Campaigns ({filteredCampaigns.length})
      </Heading>

      <Tabs
        variant="soft-rounded"
        colorScheme="blue"
        onChange={(index) => setSelectedTab(index)}
        isFitted
      >
        <TabList mb={4}>
          {TABS.map((tab) => (
            <Tab key={tab.value}>{tab.label}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {TABS.map((tab, index) => (
            <TabPanel key={tab.value} p={0}>
              {loading ? (
                <VStack spacing={4} mt={20}>
                  <Spinner size="xl" color="blue.500" />
                  <Text>Loading campaigns...</Text>
                </VStack>
              ) : filteredCampaigns.length === 0 ? (
                <Box
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  justifyContent="center"
                  minH="60vh"
                >
                  <Text fontSize="lg" color="gray.500" mb={4}>
                    No {tab.label.toLowerCase()} campaigns found.
                  </Text>
                  <Button
                    colorScheme="blue"
                    leftIcon={<AddIcon />}
                    onClick={handleCreateCampaign}
                  >
                    Create New Campaign
                  </Button>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredCampaigns.map((campaign) => (
                    <Box
                      key={campaign.id}
                      p={6}
                      bg="white"
                      borderRadius="md"
                      boxShadow="md"
                    >
                      <VStack align="start" spacing={3}>
                        <Icon as={EmailIcon} color="blue.400" boxSize={6} />
                        <Heading fontSize="xl">{campaign.name}</Heading>
                        <Text fontSize="sm" color="gray.600">
                          {campaign.description}
                        </Text>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        >
                          View Details
                        </Button>
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Campaigns;
