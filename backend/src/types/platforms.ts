import {z} from "zod";

export const platformSchema = z.object({
    id: z.string(),
    name: z.string()
})

export type Platform = z.infer<typeof platformSchema>
