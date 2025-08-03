import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  HStack,
  useToast,
} from "@chakra-ui/react";
import ModalWrapper from "./ModalWrapper";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const handleSubmit = () => {
    toast({
      title: `${mode === "login" ? "Logging in" : "Registering"}...`,
      status: "info",
      duration: 1500,
      isClosable: true,
    });

    // Simulated async logic
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Sign In" : "Sign Up"}
      footer={
        <Button colorScheme="blue" onClick={handleSubmit}>
          {mode === "login" ? "Sign In" : "Sign Up"}
        </Button>
      }
    >
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <HStack justify="center" pt={2}>
          <Text fontSize="sm">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </Text>
          <Button
            variant="link"
            colorScheme="blue"
            size="sm"
            onClick={() =>
              setMode((prev) => (prev === "login" ? "register" : "login"))
            }
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </Button>
        </HStack>
      </VStack>
    </ModalWrapper>
  );
};

export default AuthModal;
