"use clint";

import { useMutation } from "@tanstack/react-query";
import { UserLoginType } from "../UITypes/uiTypes";
import apiClient from "../api/helpers/baseApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
type ServerErrorResponse = {
  success: false;
  message: string;
};

type ServerSuccessResponse = {
  success: true;
  message: string;
};
const useLogin = () => {
  const logUser = async ({
    FormData,
  }: {
    FormData: UserLoginType;
  }): Promise<ServerSuccessResponse> => {
    const response = await apiClient.post("/auth/login", FormData);
    const data = await response.data;
    return data;
  };
  return useMutation({
    mutationFn: logUser,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const axiosErr = error as AxiosError<ServerErrorResponse>;
      if (axiosErr.response?.data.message) {
        toast.error(axiosErr.response.data.message);
      } else {
        toast.error("Something Wrong");
      }
    },
  });
};

export default useLogin;
