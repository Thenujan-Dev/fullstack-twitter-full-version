import prisma from "@/lib/prisma";
import { handleError } from "../../helpers/handleError";
import { privateRoute } from "../../helpers/privateRoute";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    return await privateRoute(async (user: { id: string }) => {
      const currentUserId = user.id;
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
      });
      if (!currentUser) {
        return NextResponse.json(
          {
            success: false,
            message: "User Not Found",
          },
          { status: 404 }
        );
      }
      const FollowingUserIds = currentUser.following;
      const FollowingPosts = await prisma.post.findMany({
        where: { autherId: { in: FollowingUserIds } },
      });
      return NextResponse.json(
        { success: true, FollowingPosts },
        { status: 201 }
      );
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to Fetch Following Posts",
    });
  }
};
