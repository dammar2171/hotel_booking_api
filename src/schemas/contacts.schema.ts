import z from "zod";

export const createContactSchema = z.object({
  name:z.string().min(2,"Name must be in atleast 2 characters"),
  email:z.string().email("Email invalid format"),
  phone:z.string().min(10,"Phone must have 10 digits"),
  subject:z.string().min(2,"subject matter should have atleast 2 character"),
  message:z.string().min(2,"atleast 2 character must invove in message"),
});