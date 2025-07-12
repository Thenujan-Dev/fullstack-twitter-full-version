import { handleError } from "@/app/api/helpers/handleError";
import { privateRoute } from "@/app/api/helpers/privateRoute";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    return await privateRoute(async (user: { id: string }) => {
      const currentUserId = user.id;
      const idStr = req.url;
      const postId = idStr.split("likeunlike/")[1];
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
      });
      if (!currentUser) {
        return NextResponse.json(
          {
            success: false,
            message: "user Not Found",
          },
          { status: 404 }
        );
      }
      const toLikePost = await prisma.post.findFirst({ where: { id: postId } });
      if (!toLikePost) {
        return NextResponse.json(
          { success: false, message: "post not found" },
          { status: 404 }
        );
      }
      const userAlreadyLiked = toLikePost?.like.some(
        (id) => id == currentUserId
      );
      if (userAlreadyLiked) {
        //dislike
        const updatedLikes = toLikePost?.like.filter(
          (id) => id !== currentUserId
        );
        await prisma.post.update({
          where: { id: postId },
          data: { like: updatedLikes },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Post Disliked",
          },
          { status: 201 }
        );
      } else {
        //like
        await prisma.post.update({
          where: { id: postId },
          data: { like: { push: currentUserId } },
        });
        await prisma.notification.create({
          data: {
            from: currentUserId,
            to: toLikePost?.autherId,
            type: "Like",
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Post Liked",
          },
          { status: 201 }
        );
      }
      return NextResponse.json({ toLikePost });
    });
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to Like to the Post" });
  }
};
