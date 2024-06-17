import {z} from "zod";

export const deviceSchema = z.object({
    id: z.string(),
    device_name: z.string(),
    owner: z.string()
})

export const linkSchema = z.object({
    id: z.number(),
    device_id: z.string(),
    platform_id: z.string()
})

export type Device = z.infer<typeof deviceSchema>
export type Link = z.infer<typeof linkSchema>
