import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import Campaigns from "./pages/Campaigns";
import Campaign from "./pages/Campaign";
import Layout from "./components/Layout/Layout";
import { useGlobalContext } from "./context";
import { sleep } from "./utils/common";
import api from "./utils/api";
import AuthModal from "./components/AuthModal";
import { connectSocket, disconnectSocket } from "./utils/socket";

const App: React.FC = () => {
  const {
    setCheckingToken,
    setUser,
    socketId,
    setSocketId,
    showSignIn,
    setShowSignIn,
  } = useGlobalContext();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setCheckingToken(true);
        const response = await api.get("/auth/profile");
        const data = response.data;
        if (data.success) {
          setUser(data.data);
          connectSocket(data.data.id, (socketId) => {
            setSocketId(socketId);
          });
        }
      } catch (error) {
        // handle error
      } finally {
        await sleep(500);
        setCheckingToken(false);
      }
    };
    verifyToken();

    return () => {
      if (socketId)
        disconnectSocket(() => {
          setSocketId("");
        });
    };
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaign/:id" element={<Campaign />} />
        </Route>
      </Routes>
      {showSignIn && (
        <AuthModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      )}
    </Layout>
  );
};

export default App;
