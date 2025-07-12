import { handleError } from "@/app/api/helpers/handleError";
import { privateRoute } from "@/app/api/helpers/privateRoute";
import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    return await privateRoute(async (user: { id: string }) => {
      let { text, commentImg } = await req.json();
      const currentUserId = user.id;
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
      const idStr = req.url;
      const postId = idStr.split("comment/")[1];
      const singlePost = await prisma.post.findFirst({ where: { id: postId } });
      if (!singlePost) {
        return NextResponse.json(
          {
            success: false,
            message: "Post Not Found",
          },
          { status: 404 }
        );
      }
      if (text) {
        await prisma.comment.create({
          data: {
            userId: currentUserId,
            postId: postId,
            text: text,
          },
        });
        await prisma.notification.create({
          data: {
            from: currentUserId,
            to: singlePost.autherId,
            type: "Comment",
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Commented successfully!",
          },
          { status: 200 }
        );
      }
      if (commentImg) {
        const uploadedResponse = await cloudinary.uploader.upload(commentImg);
        commentImg = uploadedResponse.secure_url;
        await prisma.comment.create({
          data: {
            userId: currentUserId,
            postId: postId,
            commentImg: commentImg,
          },
        });
        await prisma.notification.create({
          data: {
            from: currentUserId,
            to: singlePost.autherId,
            type: "Comment",
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Commented successfully!",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { success: false, message: "something wrong!" },
        { status: 400 }
      );
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to comment to the post",
    });
  }
};
