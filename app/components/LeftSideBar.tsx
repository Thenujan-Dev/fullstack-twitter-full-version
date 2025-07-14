"use client";
import React from "react";
import { BsTwitterX } from "react-icons/bs";
import { GoHomeFill } from "react-icons/go";
import { IoNotificationsSharp } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";

const LeftSideBar = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    <div className="w-full h-dvh bg-black">
      <div className="p-3 text-white flex flex-col gap-10 cursor-pointer">
        <div className="w-full" onClick={() => router.push("/")}>
          <BsTwitterX className="text-xl md:text-5xl" />
        </div>
        <div
          className={`${
            pathName === "/" && "bg-blue-600 px-2 py-1 rounded-md"
          } w-full flex items-center gap-1. md:hover:px-2 md:hover:py-1 md:hover:gap-2.5 md:hover:bg-slate-800 md:hover:rounded-md cursor-pointer md:duration-200 md:transition-all md:ease-linear`}
          onClick={() => router.push("/")}
        >
          <GoHomeFill className="text-xl md:text-3xl" />
          <span className="text-xl hidden md:block md:text-2xl">Home</span>
        </div>
        <div
          className={`${
            pathName === "/pages/notification" &&
            "bg-blue-600 px-2 py-1 rounded-md"
          } w-full flex items-center gap-1.5 flex-wrap md:hover:px-2 md:hover:gap-2.5 md:hover:py-1 md:hover:bg-slate-800 md:hover:rounded-md cursor-pointer md:duration-200 md:transition-all md:ease-linear`}
          onClick={() => router.push("/pages/notification")}
        >
          <IoNotificationsSharp className="text-xl md:text-3xl" />
          <span className="text-xl hidden md:block md:text-2xl">
            Notification
          </span>
        </div>
        <div
          className={`${
            pathName === "/pages/profile" && "bg-blue-600 px-2 py-1 rounded-md"
          } w-full flex items-center gap-1.5 md:hover:px-2 md:hover:py-1 md:hover:gap-2.5 md:hover:bg-slate-800 md:hover:rounded-md cursor-pointer md:duration-200 md:transition-all md:ease-linear`}
          onClick={() => router.push("/pages/profile")}
        >
          <FaUserLarge className="text-xl md:text-3xl" />
          <span className="text-xl hidden md:block md:text-2xl">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;
