import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import { privateRoute } from "../../helpers/privateRoute";

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
            message: "user Not Found",
          },
          { status: 404 }
        );
      }
      const allPosts = await prisma.post.findMany({
        where: { autherId: currentUserId },
      });
      return NextResponse.json({ success: true, allPosts }, { status: 201 });
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to fetch logged User Posts",
    });
  }
};
