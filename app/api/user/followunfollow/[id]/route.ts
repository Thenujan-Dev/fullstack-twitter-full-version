import { handleError } from "@/app/api/helpers/handleError";
import { privateRoute } from "@/app/api/helpers/privateRoute";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    return await privateRoute(async (user: { id: string }) => {
      const currentUserId = user.id;
      const loggedUser = await prisma.user.findUnique({
        where: { id: currentUserId },
      });
      if (!loggedUser) {
        return NextResponse.json(
          {
            success: false,
            message: "user not found",
          },
          { status: 404 }
        );
      }
      const idStr = req.url;
      const userToFollowId = idStr.split("followunfollow/")[1];
      const userToFollow = await prisma.user.findUnique({
        where: { id: userToFollowId },
      });
      if (!userToFollow) {
        return NextResponse.json(
          {
            success: false,
            message: "user to Follow not found",
          },
          { status: 404 }
        );
      }
      if (currentUserId.toString() === userToFollowId.toString()) {
        return NextResponse.json(
          {
            success: false,
            message: "you can't Follow yourself",
          },
          { status: 400 }
        );
      }
      const isUserAlreadyFollowed =
        loggedUser.following.includes(userToFollowId);

      if (isUserAlreadyFollowed) {
        //unfollow
        await prisma.user.update({
          where: { id: currentUserId },
          data: {
            following: loggedUser.following.filter(
              (id) => id !== userToFollowId
            ),
          },
        });
        await prisma.user.update({
          where: { id: userToFollowId },
          data: {
            followers: userToFollow.followers.filter(
              (id) => id !== currentUserId
            ),
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "unfollowed Successfully!",
          },
          { status: 200 }
        );
      } else {
        //follow
        await prisma.user.update({
          where: { id: userToFollowId },
          data: {
            followers: {
              set: [...userToFollow.followers, currentUserId],
            },
          },
        });
        await prisma.user.update({
          where: { id: currentUserId },
          data: { following: [...loggedUser.following, userToFollowId] },
        });
        await prisma.notification.create({
          data: { from: currentUserId, to: userToFollowId, type: "follow" },
        });
        return NextResponse.json(
          {
            success: true,
            message: "followed Successfully!",
          },
          { status: 200 }
        );
      }
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to follow unfollow users",
    });
  }
};
