import { NextResponse } from "next/server";
import { handleError } from "../../helpers/handleError";

export const POST = () => {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "User logged out successfully!",
      },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return handleError({ error, defaultErr: "Failed to logout user" });
  }
};
