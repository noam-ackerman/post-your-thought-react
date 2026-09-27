import { z } from "zod";

export const editProfileSchema = z.object({
  nickname: z
    .string()
    .min(1, "Nickname is required")
    .max(20, "Username is too long! Max 20 characters"),
  bio: z.string().optional(),
});

export const updateSettingsSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().optional(),
    newPasswordConfirmation: z.string().optional(),
  })
  .refine((data) => !data.newPassword || data.newPassword.length >= 6, {
    message: "Password must be at least 6 characters long",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: "Passwords do not match!",
    path: ["newPasswordConfirmation"],
  });
