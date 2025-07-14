"use client";
import Link from "next/link";
import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userLoginSchema, {
  userLoginResponse,
} from "@/schemas/user.login.schema";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<userLoginResponse>({
    mode: "onChange",
    resolver: zodResolver(userLoginSchema),
  });
  const { mutateAsync, isPending } = useLogin();
  return (
    <div className="h-dvh w-full bg-black flex items-center justify-center">
      <div className="w-[95%] h-[90%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto flex flex-col md:flex-row gap-5 md:items-center">
        <div className="text-white font-bold self-center w-[40%] flex justify-center">
          <BsTwitterX className="text-[100px] md:text-[200px] lg:text-[300px]" />
        </div>
        <div className="self-center text-white w-full md:w-[60%] h-full p-4">
          <h1 className="text-center text-3xl sm:text-4xl">Login Account</h1>
          <form
            className="md:w-[80%] w-[98%] h-[90%] mx-auto mt-4 flex flex-col space-y-4"
            onSubmit={handleSubmit(async (FormData) => {
              await mutateAsync({ FormData });
              router.push("/");
            })}
          >
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="">Username</label>
              <input
                type="text"
                placeholder="Enter The Username"
                className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                {...register("username")}
              />
              {errors.username?.message && (
                <p className="text-red-400">{errors.username.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="">Password</label>
              <input
                type="password"
                placeholder="Enter The Password"
                className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                {...register("password")}
              />
              {errors.password?.message && (
                <p className="text-red-400">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="submit"
                disabled={!isValid}
                className="bg-blue-500 text-white border-none outline-none cursor-pointer font-bold hover:bg-blue-700 transition-all duration-300 py-2 rounded-3xl"
              >
                {isPending ? <CircularProgress size={20} /> : "Login"}
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <p>Don't have an Account?</p>
              <Link
                href={"/pages/register"}
                className="py-2 text-center outline-none border-2 hover:bg-blue-100 transition-all duration-300 ease-linear hover:text-black font-bold border-blue-600 rounded-2xl cursor-pointer"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
