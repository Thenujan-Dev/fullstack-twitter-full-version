import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const privateRoute = async (
  cb: (user: { id: string }) => Promise<NextResponse>
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "User not Authorized",
        },
        { status: 400 }
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
    jwt.verify(token, secret);
    const decodedToken = jwt.decode(token) as JwtPayload & { id: string };
    const user = {
      id: decodedToken.id,
    };
    return cb(user);
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        {
          code: "invalid-token",
          message: "The token you provided is not valid.",
        },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        {
          code: "token-expired",
          message: "The token you provided has expired.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        code: "server-error",
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
};
