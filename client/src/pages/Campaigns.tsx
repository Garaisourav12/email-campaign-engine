import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Spinner,
  Text,
  VStack,
  SimpleGrid,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, EmailIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import ContentWrapper from "../components/ContentWrapper";
import { ICampaign } from "../types";
import api from "../utils/api";
import CreateCampaignModal from "../components/CreateCampaignModal";

type CampaignStatus =
  | "template"
  | "campaign"
  | "executable"
  | "ended"
  | "paused"
  | "active";

const TABS: { label: string; value: CampaignStatus }[] = [
  { label: "Campaign", value: "campaign" },
  { label: "Template", value: "template" },
  { label: "Executable", value: "executable" },
  { label: "Ended", value: "ended" },
  { label: "Paused", value: "paused" },
  { label: "Active", value: "active" },
];

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const navigate = useNavigate();
  // const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        setLoading(true);
        const response = await api.get("/campaigns");
        const data = response.data;
        if (data.success) {
          setCampaigns(data.data);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    getCampaigns();
  }, []);

  const handleCreateCampaign = () => {
    onOpen();
  };

  const currentTab = TABS[selectedTab].value;
  const currentTabLabel = TABS[selectedTab].label;
  const filteredCampaigns = campaigns.filter((c) => {
    if (currentTab === "campaign") return true;
    if (currentTab === "template") return !c.customerEmail;
    if (currentTab === "executable")
      return c.customerEmail && c.state === "default";
    if (currentTab === "ended") return c.state === "ended";
    if (currentTab === "paused") return c.state === "paused";
    if (currentTab === "active") return c.state === "active";
    return true;
  });

  return (
    <>
      <Flex
        direction={"column"}
        bg="gray.50"
        flex={1}
        minH={"fit-content"}
        py={6}
      >
        <ContentWrapper
          display={"flex"}
          flexDirection={"column"}
          flex={1}
          minH={"fit-content"}
        >
          <Heading mb={6} color="blue.700">
            {currentTabLabel === "Campaign" ? "" : currentTabLabel + " "}
            Campaigns ({filteredCampaigns.length})
          </Heading>

          <Tabs
            flex={1}
            display={"flex"}
            flexDirection={"column"}
            variant="soft-rounded"
            colorScheme="blue"
            onChange={(index) => setSelectedTab(index)}
            isFitted
          >
            <TabList
              mb={4}
              overflowX={"auto"}
              sx={{
                "&::-webkit-scrollbar": {
                  height: "0px", // Chrome, Safari, Opera
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value}>{tab.label}</Tab>
              ))}
            </TabList>

            <TabPanels flex={1} display={"flex"} flexDirection={"column"}>
              {TABS.map((tab, index) => (
                <TabPanel
                  key={tab.value}
                  p={0}
                  flex={1}
                  display={"flex"}
                  flexDirection={"column"}
                >
                  {loading ? (
                    <VStack spacing={4} mt={20}>
                      <Spinner size="xl" color="blue.500" />
                      <Text>Loading campaigns...</Text>
                    </VStack>
                  ) : filteredCampaigns.length === 0 ? (
                    <Flex
                      flex={1}
                      flexDir="column"
                      alignItems="center"
                      justifyContent="center"
                      pb={20}
                    >
                      <Text fontSize="lg" color="gray.500" mb={4}>
                        No {currentTab === "campaign" ? "" : currentTab + " "}
                        campaigns found.
                      </Text>
                      <Button
                        colorScheme="blue"
                        leftIcon={<AddIcon />}
                        onClick={handleCreateCampaign}
                      >
                        Create New Campaign
                      </Button>
                    </Flex>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {filteredCampaigns.map((campaign) => (
                        <Box
                          key={campaign._id}
                          p={6}
                          bg="white"
                          borderRadius="md"
                          boxShadow="md"
                          border={"1px solid"}
                          borderColor={"gray.300"}
                        >
                          <VStack align="start" spacing={3}>
                            <Icon as={EmailIcon} color="blue.400" boxSize={6} />
                            <Heading fontSize="xl">{campaign.name}</Heading>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() =>
                                navigate(`/campaign/${campaign._id}`)
                              }
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
        </ContentWrapper>
      </Flex>
      {isOpen && <CreateCampaignModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default Campaigns;
