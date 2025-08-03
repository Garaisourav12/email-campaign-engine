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

const App: React.FC = () => {
  const { setCheckingToken, setUser } = useGlobalContext();
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setCheckingToken(true);
        const response = await api.get("/auth/profile");
        console.log(response.data);
      } catch (error) {
        // handle error
      } finally {
        await sleep(500);
        setCheckingToken(false);
      }
    };
    verifyToken();
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
    </Layout>
  );
};

export default App;
