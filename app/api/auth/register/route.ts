import { NextRequest, NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";
import userRegisterSchema from "@/schemas/user.register.schema";
import { hash } from "argon2";
import prisma from "@/lib/prisma";
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const validatedData = userRegisterSchema.parse(body);
    const hashedPassword = await hash(validatedData.password);
    const isEmailExist = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });
    const isUsernameExist = await prisma.user.findUnique({
      where: { username: validatedData.username },
    });
    if (isEmailExist || isUsernameExist) {
      return NextResponse.json(
        {
          success: false,
          message: "Username OR EmailId of this user is Already Exist",
        },
        { status: 409 }
      );
    }
    const hashedConfirmPassword = await hash(validatedData.confirmPassword);
    const newUser = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: "user created successfully",
        newUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to Register users" });
  }
};
