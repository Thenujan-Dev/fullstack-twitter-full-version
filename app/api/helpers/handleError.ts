import { NextResponse } from "next/server";
import z from "zod";

export const handleError = ({
  error,
  defaultErr,
}: {
  error: any;
  defaultErr: string;
}) => {
  console.log(error);
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation Failed",
        error: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }
  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error" + defaultErr,
    },
    { status: 500 }
  );
};
