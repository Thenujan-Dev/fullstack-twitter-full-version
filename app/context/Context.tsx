"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { SuggestedUserResponse } from "../UITypes/uiTypes";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";

type contextType = {
  suggestedUsers: SuggestedUserResponse[];
  setSuggestedUsers: Dispatch<SetStateAction<SuggestedUserResponse[]>>;
};
const AppContext = createContext<contextType | null>(null);
const Context = ({ children }: { children: ReactNode }) => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUserResponse[]>(
    []
  );
  const { data: suggestedUsersData } = useGetSuggestedUsers();

  useEffect(() => {
    if (suggestedUsersData?.suggestedUsers) {
      setSuggestedUsers(suggestedUsersData.suggestedUsers);
    }
  }, [suggestedUsersData?.suggestedUsers]);
  return (
    <AppContext.Provider value={{ suggestedUsers, setSuggestedUsers }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("the child must be inside provider");
  }
  return context;
};

export { Context, useGlobalContext };
