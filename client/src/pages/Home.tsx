import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { AtSignIcon, TimeIcon, SettingsIcon } from "@chakra-ui/icons";
import ContentWrapper from "../components/ContentWrapper";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box bg="gray.50" py={16}>
      <ContentWrapper>
        {/* Hero Section */}
        <VStack spacing={6} textAlign="center" mb={16}>
          <Heading fontSize={{ base: "3xl", md: "5xl" }} color="blue.700">
            Launch Campaigns in Minutes
          </Heading>
          <Text fontSize="lg" maxW="600px">
            CampaignEngine helps you create, manage, and automate email
            campaigns with ease and flexibility.
          </Text>
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => navigate("/campaigns")}
          >
            Get Started
          </Button>
        </VStack>

        {/* Features Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          <Feature
            icon={AtSignIcon}
            title="Fast Setup"
            text="Start a campaign with just a few clicks. No hassle, no delays."
          />
          <Feature
            icon={TimeIcon}
            title="Track Performance"
            text="Real-time analytics to help you measure and optimize."
          />
          <Feature
            icon={SettingsIcon}
            title="Custom Workflows"
            text="Design flexible flows to automate communication with your users."
          />
        </SimpleGrid>
      </ContentWrapper>
    </Box>
  );
};

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  text: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, text }) => {
  return (
    <VStack bg="white" p={6} borderRadius="lg" boxShadow="md" align="start">
      <Icon as={icon} boxSize={8} color="blue.500" />
      <Heading fontSize="xl">{title}</Heading>
      <Text>{text}</Text>
    </VStack>
  );
};

export default Home;
