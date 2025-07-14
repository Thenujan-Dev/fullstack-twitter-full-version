"use client";

import { useQuery } from "@tanstack/react-query";

import apiClient from "../api/helpers/baseApi";
import { SuggestedUserResponse } from "../UITypes/uiTypes";

const useGetSuggestedUsers = () => {
  const getAllSuggestedUsers = async (): Promise<{
    suggestedUsers: SuggestedUserResponse[];
  }> => {
    const respose = await apiClient.get("/user/suggesteduser");
    const data = await respose.data;
    return data;
  };
  return useQuery({
    queryKey: ["get-suggestedUsers"],
    queryFn: getAllSuggestedUsers,
  });
};

export default useGetSuggestedUsers;
