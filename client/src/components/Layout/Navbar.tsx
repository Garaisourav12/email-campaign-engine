// src/components/Navbar.tsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Avatar,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { useGlobalContext } from "../../context";
import ContentWrapper from "../ContentWrapper";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar: React.FC = () => {
  const { user, isMobile } = useGlobalContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const linkStyle = {
    px: 0,
    py: 1,
    borderRadius: "md",
    fontWeight: "medium",
    _hover: { color: "blue.500" },
  };

  const activeStyle = {
    color: "blue.500",
    fontWeight: "bold",
  };

  return (
    <>
      <Box bg="white" borderBottom="1px solid" borderColor="gray.300">
        <ContentWrapper>
          <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            py={4}
          >
            <Text fontSize="xl" fontWeight="bold" color="blue.700">
              CampaignEngine
            </Text>

            {/* Desktop Menu */}
            <Flex gap={5} alignItems="center">
              {!isMobile && (
                <>
                  <NavLink to="/">
                    {({ isActive }) => (
                      <Box {...linkStyle} {...(isActive ? activeStyle : {})}>
                        Home
                      </Box>
                    )}
                  </NavLink>

                  <NavLink to="/campaigns">
                    {({ isActive }) => (
                      <Box {...linkStyle} {...(isActive ? activeStyle : {})}>
                        Campaigns
                      </Box>
                    )}
                  </NavLink>

                  {user ? (
                    <Avatar
                      size="sm"
                      cursor="pointer"
                      onClick={() => navigate("/profile")}
                    />
                  ) : (
                    <Button
                      colorScheme="blue"
                      onClick={() => navigate("/signin")}
                    >
                      Sign In
                    </Button>
                  )}
                </>
              )}

              {/* Mobile Drawer Button */}
              {isMobile && (
                <HamburgerIcon onClick={onOpen} cursor="pointer" boxSize={6} />
              )}
            </Flex>
          </Flex>
        </ContentWrapper>
      </Box>

      {/* Nav Drawer for mobile */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="start">
              <NavLink to="/" onClick={onClose}>
                {({ isActive }) => (
                  <Box {...linkStyle} {...(isActive ? activeStyle : {})}>
                    Home
                  </Box>
                )}
              </NavLink>

              <NavLink to="/campaigns" onClick={onClose}>
                {({ isActive }) => (
                  <Box {...linkStyle} {...(isActive ? activeStyle : {})}>
                    Campaigns
                  </Box>
                )}
              </NavLink>

              {user ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    navigate("/profile");
                    onClose();
                  }}
                >
                  Profile
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    navigate("/signin");
                    onClose();
                  }}
                >
                  Sign In
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
