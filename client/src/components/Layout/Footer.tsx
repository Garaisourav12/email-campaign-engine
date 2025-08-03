import React from "react";
import { Box, Flex, Text, Link as ChakraLink } from "@chakra-ui/react";
import ContentWrapper from "../ContentWrapper";
import { Link } from "react-router-dom";

type Props = {};

const Footer: React.FC<Props> = () => {
  return (
    <Box bg="gray.800" color="whiteAlpha.900">
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
              <ChakraLink
                href="mailto:garaisourav12@gmail.com"
                fontSize="sm"
                _hover={{ color: "blue.500", textDecoration: "underline" }}
              >
                garaisourav12@gmail.com
              </ChakraLink>
              <ChakraLink
                href="tel:+919732224977"
                fontSize="sm"
                _hover={{ color: "blue.500", textDecoration: "underline" }}
              >
                +91 97322 24977
              </ChakraLink>
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
              <Link to="/">
                <Text
                  fontSize="sm"
                  _hover={{ color: "blue.500", textDecoration: "underline" }}
                >
                  Home
                </Text>
              </Link>
              <Link to="/campaigns">
                <Text
                  fontSize="sm"
                  _hover={{ color: "blue.500", textDecoration: "underline" }}
                >
                  Campaigns
                </Text>
              </Link>
              <Link to="/profile">
                <Text
                  fontSize="sm"
                  _hover={{ color: "blue.500", textDecoration: "underline" }}
                >
                  Profile
                </Text>
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
