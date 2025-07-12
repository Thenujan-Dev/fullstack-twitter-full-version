import prisma from "@/lib/prisma";
import { handleError } from "../../helpers/handleError";
import { privateRoute } from "../../helpers/privateRoute";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    return await privateRoute(async (user: { id: string }) => {
      const currentUserId = user.id;
      const allusersNotLoggedUser = await prisma.user.findMany({
        where: { id: { not: currentUserId } },
      });
      const lggedUser = await prisma.user.findUnique({
        where: { id: currentUserId },
      });
      const currentUserFollowingIds = lggedUser?.following;
      const suggestedUsers = allusersNotLoggedUser.filter(
        (user) => !currentUserFollowingIds?.includes(user.id)
      );
      return NextResponse.json({ suggestedUsers });
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to fecth suggested users",
    });
  }
};
