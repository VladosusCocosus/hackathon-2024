import {z} from "zod";

export const projectSchema = z.object({
    id: z.string(),
    name: z.string(),
    user_id: z.string(),
    device_id: z.string() 
})

export type Project = z.infer<typeof projectSchema>
