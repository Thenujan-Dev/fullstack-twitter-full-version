"use client";
import React from "react";
import useGetSuggestedUsers from "../hooks/useGetSuggestedUsers";
import RightSidebarSkeleton from "./Loder1";
import { useGlobalContext } from "../context/Context";
import Image from "next/image";

const RightSideBar = () => {
  const { isLoading } = useGetSuggestedUsers();
  const { suggestedUsers } = useGlobalContext();
  if (isLoading)
    return (
      <div className="w-full bg-black h-dvh">
        <RightSidebarSkeleton />
      </div>
    );
  return (
    suggestedUsers && (
      <div className="w-full bg-black h-dvh text-white">
        <div className="min-h-[50%] p-3">
          <h1 className="capitalize font-bold text-sm text-wrap md:text-nowrap md:text-lg text-ellipsis">
            Who to Follow
          </h1>
          <div className="flex flex-col space-y-6">
            {suggestedUsers.map((suggestedUsr) => (
              <div
                key={suggestedUsr.id}
                className="flex flex-col md:flex-row gap-3 items-center"
              >
                <div>
                  {suggestedUsr.profilePic ? (
                    <Image
                      alt="profile"
                      src={suggestedUsr.profilePic}
                      height={70}
                      width={70}
                      className="object-cover bg-cover bg-center"
                    />
                  ) : (
                    <div className="w-10  h-10 flex items-center justify-center bg-blue-400 rounded-full text-white font-bold">
                      {suggestedUsr.fullname[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-white font-bold text-xs text-wrap md:text-nowrap md:text-lg">
                    {suggestedUsr.fullname}
                  </h1>
                  <h3 className="text-slate-400 lowercase text-xs text-wrap md:text-nowrap md:text-lg">
                    @{suggestedUsr.username}
                  </h3>
                </div>
                <div>
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-500 text-white cursor-pointer outline-none border-none rounded-2xl"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default RightSideBar;
