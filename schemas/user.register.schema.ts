import { z } from "zod";

const userRegisterSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must include at least one special character"
      ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
    link: z.string().min(1, { message: "Link isb Required" }),
    bio: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default userRegisterSchema;
export type userRegisterResponse = z.infer<typeof userRegisterSchema>;
