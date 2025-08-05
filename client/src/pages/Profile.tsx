import React from "react";
import { Box, Flex, Avatar, Text, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context";
import api from "../utils/api";
import { disconnectSocket } from "../utils/socket";

type Props = {};

const Profile: React.FC<Props> = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, setUser, setSocketId } = useGlobalContext();
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/logout");
      const data = response.data;
      if (data.success) {
        disconnectSocket(() => {
          setSocketId("");
        });
        navigate("/");
        setUser(null);
      } else {
        toast({
          title: "Sign out failed!",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Sign out failed!",
        description: "Something went wrong.S",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      flex={1}
      direction="column"
      align="center"
      justify="center"
      bg="gray.50"
      px={4}
    >
      <Avatar name={user.email} size="xl" mb={4} />
      <Text fontSize="xl" fontWeight="bold" mb={3}>
        {user.email}
      </Text>
      <Button colorScheme="red" onClick={handleSignOut} isLoading={loading}>
        Sign Out
      </Button>
    </Flex>
  );
};

export default Profile;
