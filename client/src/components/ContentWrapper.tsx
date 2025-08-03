import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ContentWrapper: React.FC<Props> = ({ children }) => {
  return (
    <Box w={{ base: "93%", md: "90%" }} mx={"auto"}>
      {children}
    </Box>
  );
};

export default ContentWrapper;
