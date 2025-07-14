"use client";
import Link from "next/link";
import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userRegisterSchema, {
  userRegisterResponse,
} from "@/schemas/user.register.schema";
import useRegister from "../hooks/useRegister";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
const RegisterPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<userRegisterResponse>({
    mode: "onChange",
    resolver: zodResolver(userRegisterSchema),
  });
  const { isPending, mutateAsync } = useRegister();
  const router = useRouter();
  return (
    <div className="h-dvh w-full bg-black flex items-center justify-center">
      <div className="w-[95%] h-[90%] sm:w-[90%] md:w-[85%] lg:w-[80%] mx-auto flex flex-col md:flex-row gap-5 md:items-center ">
        {/******** */}
        <div className="text-white font-bold self-center w-[40%] flex justify-center">
          <BsTwitterX className="text-[100px] md:text-[200px] lg:text-[300px] " />
        </div>
        {/******** */}
        <div className="self-center text-white w-full  md:w-[60%] h-full p-4">
          <h1 className="text-center text-3xl sm:text-4xl">Create Account</h1>
          <form
            className="md:w-[80%] w-[98%] h-[90%] mx-auto mt-4 flex flex-col justify-between"
            onSubmit={handleSubmit(async (FormData) => {
              await mutateAsync({ FormData });
              router.push("/pages/login");
            })}
          >
            <div className="flex flex-row items-center gap-2 w-full">
              <div className="flex flex-col gap-0.5 text-xs w-[50%]">
                <label htmlFor="">FullName</label>
                <input
                  type="text"
                  placeholder="Enter The Full Name"
                  className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                  {...register("fullname")}
                />
                {errors && (
                  <p className="text-red-400">{errors.fullname?.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 text-xs w-[50%]">
                <label htmlFor="">username</label>
                <input
                  type="text"
                  placeholder="Enter The Username"
                  className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                  {...register("username")}
                />
                {errors && (
                  <p className="text-red-400">{errors.username?.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 w-full">
              <div className="flex flex-col gap-1.5 text-xs w-[50%]">
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  placeholder="Enter The Email"
                  className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                  {...register("email")}
                />
                {errors && (
                  <p className="text-red-400">{errors.email?.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 text-xs w-[50%]">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  placeholder="Enter The Password"
                  className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                  {...register("password")}
                />
                {errors && (
                  <p className="text-red-400">{errors.password?.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 w-full">
              <div className="flex flex-col gap-1.5 text-xs w-[50%]">
                <label htmlFor="">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Enter The Confirm Password"
                  className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                  {...register("confirmPassword")}
                />
                {errors && (
                  <p className="text-red-400">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 text-xs w-[50%]">
                <label htmlFor="">Bio</label>
                <input
                  type="text"
                  placeholder="Enter The Bio"
                  className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                  {...register("bio")}
                />
                {errors && (
                  <p className="text-red-400">{errors.bio?.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs w-full">
              <label htmlFor="">Link</label>
              <input
                type="text"
                placeholder="Enter The Link"
                className="border-1 border-slate-400 px-2 py-1 rounded-md outline-none"
                {...register("link")}
              />
              {errors && <p className="text-red-400">{errors.link?.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                type="submit"
                disabled={!isValid}
                className="bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white border-none outline-none cursor-pointer font-bold hover:bg-blue-700 transition-all duration-300 py-2 rounded-3xl"
              >
                {isPending ? <CircularProgress size={20} /> : "Register"}
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <p>if you have an Account</p>
              <Link
                href={"/pages/login"}
                className="py-2 flex justify-center outline-none border-2 hover:bg-blue-100 transition-all duration-300 ease-linear hover:text-black font-bold border-blue-600 rounded-2xl cursor-pointer"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
