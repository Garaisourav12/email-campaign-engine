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
import api from "../utils/api";
import { useGlobalContext } from "../context";
import { connectSocket } from "../utils/socket";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setUser, setSocketId } = useGlobalContext();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast({
    position: "top",
    duration: 3000,
    isClosable: true,
  });

  const handleSubmit = async () => {
    setLoading(true);
    if (mode === "login") {
      try {
        const response = await api.post("/auth/login", { email, password });
        const data = response.data;
        if (data.success) {
          setUser(data.data.user);
          connectSocket(data.data.user._id, (socketId) => {
            setSocketId(socketId);
          });
          toast({
            title: "Login Successful!",
            status: "success",
          });
        } else {
          toast({
            title: "Login Failed!",
            description: data.message,
            status: "error",
          });
        }
      } catch (error) {
        toast({
          title: "Login Failed!",
          description: "Something went wrong. Please try again.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await api.post("/auth/register", { email, password });
        const data = response.data;
        if (data.success) {
          toast({
            title: "Registration Successful!",
            status: "success",
          });
        } else {
          toast({
            title: "Registration Failed!",
            description: data.message,
            status: "error",
          });
        }
      } catch (error) {
        toast({
          title: "Registration Failed!",
          description: "Something went wrong. Please try again.",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "login" ? "Sign In" : "Sign Up"}
      footer={
        <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
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
