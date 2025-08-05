import { useBreakpointValue } from "@chakra-ui/react";
import { createContext, useState } from "react";

interface IGlobalContext {
  user: any;
  checkingToken: boolean;
  showSignIn: boolean;
  isMobile: boolean | undefined;
  socketId: string;

  setUser: (user: any) => void;
  setCheckingToken: (checkingToken: boolean) => void;
  setShowSignIn: (showLogin: boolean) => void;
  setSocketId: (socketId: string) => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  user: undefined,
  checkingToken: true,
  showSignIn: false,
  isMobile: undefined,
  socketId: "",

  setUser: () => {},
  setCheckingToken: () => {},
  setShowSignIn: () => {},
  setSocketId: () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [user, setUser] = useState(undefined);
  const [checkingToken, setCheckingToken] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [socketId, setSocketId] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        user,
        checkingToken,
        showSignIn,
        isMobile,
        socketId,
        setUser,
        setCheckingToken,
        setShowSignIn,
        setSocketId,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
