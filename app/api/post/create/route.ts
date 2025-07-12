import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import { privateRoute } from "../../helpers/privateRoute";
import cloudinary from "@/lib/cloudinary";

export const POST = async (req: NextRequest) => {
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
            message: "user Not Found",
          },
          { status: 404 }
        );
      }
      let { blogImg, content } = await req.json();
      if (!blogImg && !content) {
        return NextResponse.json(
          {
            success: false,
            message:
              "You Have to provide atleast one either blog Image OR Post Content",
          },
          { status: 400 }
        );
      }
      if (content) {
        const newPost = await prisma.post.create({
          data: {
            auther: {
              connect: {
                id: currentUserId,
              },
            },
            content,
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Post Created",
            newPost,
          },
          { status: 201 }
        );
      }
      if (blogImg) {
        const uploadedResponse = await cloudinary.uploader.upload(blogImg);
        blogImg = uploadedResponse.secure_url;

        const newPost = await prisma.post.create({
          data: {
            auther: {
              connect: {
                id: currentUserId,
              },
            },
            blogImg,
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Post Created",
            newPost,
          },
          { status: 201 }
        );
      }
      if (content && blogImg) {
        const newPost = await prisma.post.create({
          data: {
            auther: {
              connect: {
                id: currentUserId,
              },
            },
            content,
            blogImg,
          },
        });
        return NextResponse.json(
          {
            success: true,
            message: "Post Created",
            newPost,
          },
          { status: 201 }
        );
      }
      return NextResponse.json(
        { message: "something Error", success: false },
        { status: 400 }
      );
    });
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to create post" });
  }
};
