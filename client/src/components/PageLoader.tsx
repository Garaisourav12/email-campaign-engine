import { Flex, Spinner } from "@chakra-ui/react";

const PageLoader = () => {
  return (
    <Flex
      height="100vh"
      width="100vw"
      align="center"
      justify="center"
      bg="gray.50"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
};

export default PageLoader;
