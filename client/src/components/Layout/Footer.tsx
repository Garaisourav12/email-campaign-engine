import React from "react";
import { Box, Flex, Text, Link } from "@chakra-ui/react";
import ContentWrapper from "../ContentWrapper";

type Props = {};

const Footer: React.FC<Props> = () => {
  return (
    <Box bg="gray.800" color="whiteAlpha.900" mt={8}>
      <ContentWrapper>
        <Box as="footer" py={{ base: 6, md: 8 }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            alignItems="flex-start"
            gap={{ base: 6, md: 4 }}
          >
            {/* Contact Section */}
            <Flex
              direction="column"
              alignItems={{ base: "center", md: "flex-start" }}
              gap={1}
              w={{ base: "full", md: "auto" }}
            >
              <Text fontWeight="bold" fontSize="md">
                Contact Us
              </Text>
              <Text fontSize="sm">support@campaignengine.com</Text>
              <Text fontSize="sm">+91 98765 43210</Text>
            </Flex>

            {/* Links Section */}
            <Flex
              direction="column"
              alignItems={{ base: "center", md: "flex-start" }}
              gap={1}
              w={{ base: "full", md: "auto" }}
            >
              <Text fontWeight="bold" fontSize="md">
                Quick Links
              </Text>
              <Link href="/" fontSize="sm">
                Home
              </Link>
              <Link href="/campaigns" fontSize="sm">
                Campaigns
              </Link>
              <Link href="/profile" fontSize="sm">
                Profile
              </Link>
            </Flex>

            {/* Copyright */}
            <Text
              fontSize="sm"
              alignSelf={"center"}
              align={{ base: "center", md: "right" }}
              w={{ base: "full", md: "auto" }}
            >
              © {new Date().getFullYear()} CampaignEngine. All rights reserved.
            </Text>
          </Flex>
        </Box>
      </ContentWrapper>
    </Box>
  );
};

export default Footer;
