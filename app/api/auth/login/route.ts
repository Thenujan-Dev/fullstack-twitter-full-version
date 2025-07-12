import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import userLoginSchema from "@/schemas/user.login.schema";
import { verify as verifyPassword } from "argon2";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = userLoginSchema.parse(body);
    const user = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        { status: 404 }
      );
    }
    const isPasswordValid = await verifyPassword(
      user.password,
      validatedData.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Credentials",
        },
        { status: 404 }
      );
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "please provide the secret secret not found",
        },
        { status: 401 }
      );
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "15d" });
    const response = NextResponse.json(
      {
        success: true,
        message: "user logged in successfully!",
      },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "strict",
      path: "/",
    });
    return response;
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to Login users" });
  }
};
