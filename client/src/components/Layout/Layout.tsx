import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <Flex
      minH={"100vh"}
      w={"full"}
      direction={"column"}
      justifyContent={"space-between"}
    >
      <header className="header">
        <Navbar />
      </header>
      <Flex direction={"column"} as="main" flex={1}>
        {children}
      </Flex>
      <footer>
        <Footer />
      </footer>
    </Flex>
  );
};

export default Layout;
