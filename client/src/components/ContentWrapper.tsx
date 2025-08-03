import { Box, BoxProps } from "@chakra-ui/react";
import React from "react";

type Props = {
  children: React.ReactNode;
} & BoxProps;

const ContentWrapper: React.FC<Props> = ({ children, ...props }) => {
  return (
    <Box w={{ base: "93%", md: "90%" }} mx={"auto"} {...props}>
      {children}
    </Box>
  );
};

export default ContentWrapper;
