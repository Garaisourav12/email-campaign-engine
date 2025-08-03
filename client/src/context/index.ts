import { useContext } from "react";
import { GlobalContext } from "./globalConetxt";

export const useGlobalContext = () => useContext(GlobalContext);
