import { useBreakpointValue } from "@chakra-ui/react";
import { createContext, useState } from "react";

interface IGlobalContext {
  user: any;
  checkingToken: boolean;
  showSignIn: boolean;
  isMobile: boolean | undefined;

  setUser: (user: any) => void;
  setCheckingToken: (checkingToken: boolean) => void;
  setShowSignIn: (showLogin: boolean) => void;
}

export const GlobalContext = createContext<IGlobalContext>({
  user: undefined,
  checkingToken: true,
  showSignIn: false,
  isMobile: undefined,

  setUser: () => {},
  setCheckingToken: () => {},
  setShowSignIn: () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [user, setUser] = useState(undefined);
  const [checkingToken, setCheckingToken] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <GlobalContext.Provider
      value={{
        user,
        checkingToken,
        showSignIn,
        isMobile,
        setUser,
        setCheckingToken,
        setShowSignIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
