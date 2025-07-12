import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import z from "zod";
import { hash, verify } from "argon2";
import { privateRoute } from "../../helpers/privateRoute";
import prisma from "@/lib/prisma";

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
            message: "User Not Found",
          },
          { status: 404 }
        );
      }
      const {
        fullname,
        username,
        email,
        Newpassword,
        currentPassword,
        link,
        bio,
        profilePic,
        coverPic,
      } = await req.json();
      if (
        (currentPassword && !Newpassword) ||
        (Newpassword && !currentPassword)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "you Have to Provide both currentPassword and new Password",
          },
          { status: 400 }
        );
      }

      if (currentPassword && Newpassword) {
        const isPasswordCorrect = await verify(
          currentUser.password,
          currentPassword
        );

        if (!isPasswordCorrect) {
          return NextResponse.json(
            {
              success: false,
              message: "Your Current Password is Incorrect",
            },
            { status: 400 }
          );
        }
        const passwordValidation = z
          .string()
          .min(8, {
            message: "Password must be at least 8 characters long",
          })
          .regex(/[a-z]/, {
            message: "Password must contain a lowercase letter",
          })
          .regex(/[A-Z]/, {
            message: "Password must contain an uppercase letter",
          })
          .regex(/[0-9]/, { message: "Password must contain a number" })
          .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain a special character",
          })
          .nonempty({ message: "Password is required" });

        const result = passwordValidation.safeParse(Newpassword);
        if (!result.success) {
          return NextResponse.json(
            {
              success: false,
              message: result.error.issues[0].message,
            },
            { status: 400 }
          );
        }

        const isMatch = await verify(currentUser.password, currentPassword);
        if (!isMatch) {
          return NextResponse.json(
            {
              success: false,
              message: "Your current Password is invalid",
            },
            { status: 400 }
          );
        }
        const hashedNewPassword = await hash(Newpassword);
        await prisma.user.update({
          where: { id: currentUserId },
          data: { password: hashedNewPassword },
        });
      }
      await prisma.user.update({
        where: { id: currentUserId },
        data: {
          fullname: fullname ?? currentUser.fullname,
          username: username ?? currentUser.username,
          email: email ?? currentUser.email,
          profilePic: profilePic ?? currentUser.profilePic,
          coverPic: coverPic ?? currentUser.coverPic,
          bio: bio ?? currentUser.bio,
          link: link ?? currentUser.link,
        },
      });
      return NextResponse.json(
        {
          success: true,
          message: "User Updated Successfully",
        },
        { status: 201 }
      );
    });
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to update user" });
  }
};
