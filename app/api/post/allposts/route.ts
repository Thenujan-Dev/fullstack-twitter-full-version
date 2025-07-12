import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import { privateRoute } from "../../helpers/privateRoute";
import prisma from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
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
      const allPosts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          comment: {
            select: {
              text: true,
              commentImg: true,
              userId: true,
              user: {
                select: { username: true },
              },
              createdAt: true,
            },
          },
        },
      });
      return NextResponse.json({
        success: true,
        allPosts,
      });
    });
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to fetch All Posts" });
  }
};
