import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import ContentWrapper from "./ContentWrapper";

type EntityNotFoundProps = {
  message?: string;
};

const EntityNotFound: React.FC<EntityNotFoundProps> = ({ message }) => {
  return (
    <ContentWrapper flex={1} display={"flex"} flexDirection={"column"} pb={20}>
      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        height="100%"
        color="gray.500"
        textAlign="center"
        p={6}
      >
        <Icon as={WarningIcon} w={10} h={10} color="yellow.400" mb={4} />
        <Text fontSize="xl" fontWeight="semibold" mb={2}>
          Entity Not Found
        </Text>
        <Text fontSize="sm" maxW="md">
          {message ||
            "The entity you're looking for does not exist or has been removed."}
        </Text>
      </Flex>
    </ContentWrapper>
  );
};

export default EntityNotFound;
