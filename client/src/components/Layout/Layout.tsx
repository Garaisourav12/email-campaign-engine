import React from "react";
import { Flex } from "@chakra-ui/react";
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
      <main style={{ flex: 1 }}>{children}</main>
      <footer>
        <Footer />
      </footer>
    </Flex>
  );
};

export default Layout;
