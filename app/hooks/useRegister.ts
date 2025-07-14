"use client";

import { useMutation } from "@tanstack/react-query";
import { UserRegisterType } from "../UITypes/uiTypes";
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
const useRegister = () => {
  const regUser = async ({
    FormData,
  }: {
    FormData: UserRegisterType;
  }): Promise<ServerSuccessResponse> => {
    const response = await apiClient.post("/auth/register", FormData);
    const data = await response.data;
    return data;
  };
  return useMutation({
    mutationFn: regUser,
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ServerErrorResponse>;
      if (axiosError.response?.data.message) {
        toast.error(axiosError.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};

export default useRegister;
