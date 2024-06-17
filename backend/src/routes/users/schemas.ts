import {z} from "zod";
import validator from "validator";

export const userSchema = z.object({
    id: z.string(),
    email: z.string().refine(validator.isEmail),
    name: z.string().min(2),
    password: z.string().min(8)
})

export const registrationUserInput = z.object({
    email: z.string().refine(validator.isEmail),
    name: z.string().min(2),
    password: z.string().min(8)
})

export const loginUserInput = z.object({
    email: z.string().refine(validator.isEmail),
    password: z.string().min(8)
})


export type User = z.infer<typeof userSchema>
