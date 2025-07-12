import prisma from "@/lib/prisma";
import { handleError } from "../helpers/handleError";
import { privateRoute } from "../helpers/privateRoute";
import { NextResponse } from "next/server";

export const GET = async () => {
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
            message: "user not found!",
          },
          { status: 404 }
        );
      }

      const allNotification = await prisma.notification.findMany({
        where: { to: currentUserId },
        orderBy: { createdAt: "desc" },
      });
      const fromIds = Array.from(new Set(allNotification.map((n) => n.from)));
      const fromUsers = await prisma.user.findMany({
        where: { id: { in: fromIds } },
        select: { username: true, id: true },
      });
      const idToUsernameMap: Record<string, string> = {};
      fromUsers.map((user) => {
        idToUsernameMap[user.id] = user.username;
      });
      const formattedNotifications = allNotification.map((notification) => {
        const username = idToUsernameMap[notification.from] ?? "unknown";
        switch (notification.type) {
          case "Comment":
            return `${username} commented On Your Post`;
          case "Like":
            return `${username} Like Your Post`;
          case "follow":
            return `${username}  start Following You`;
        }
      });

      return NextResponse.json(
        { success: true, formattedNotifications },
        { status: 200 }
      );
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to get All Notifications",
    });
  }
};

export const DELETE = async () => {
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
            message: "user not found!",
          },
          { status: 404 }
        );
      }
      await prisma.notification.deleteMany({});

      return NextResponse.json(
        {
          success: true,
          message: "all notifications deleted successfully",
        },
        { status: 201 }
      );
    });
  } catch (error) {
    return handleError({
      error,
      defaultErr: "Failed to delete All Notifications",
    });
  }
};
