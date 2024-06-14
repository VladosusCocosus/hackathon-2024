import {z} from "zod";

const deviceSchema = z.object({
    id: z.string(),
    device_name: z.string(),
    owner: z.string()
})

const linkSchema = z.object({
    id: z.number(),
    device_id: z.string(),
    platform_id: z.string()
})

export type Device = z.infer<typeof deviceSchema>
export type Link = z.infer<typeof linkSchema>
