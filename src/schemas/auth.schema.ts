import { z } from "zod";

export const registerUserSchema = z.object({
  name:z.string().min(2,"Name must be in at least two character!"),
  email:z.email("Email invalid format"),
  password:z.string().min(6,"Password must be at least 6 character"),
  confirmPsd:z.string().min(6,"Password must be at least 6 character")
})

export const loginUserSchema = z.object({
  email:z.email("Email invalid format!"),
  password:z.string().min(1,"Password is required!")
})

export const UpdateUserSchema = z.object({
  currentPassword:z.string().min(1,"Password is required!"),
  newPassword:z.string().min(1,"Password is required!"),
})