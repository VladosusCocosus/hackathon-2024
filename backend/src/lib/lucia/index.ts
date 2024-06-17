import { Lucia } from "lucia";
import {db} from "../db";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";

const adapter = new NodePostgresAdapter(db, {
    user: "users",
    session: 'sessions'
})

export const lucia = new Lucia(adapter, {
    getUserAttributes: (attributes) => ({
      name: attributes.name,
      email: attributes.email,
    }),
    sessionCookie: {
        attributes: {
            // set to `true` when using HTTPS
            secure: process.env.NODE_ENV === "production"
        }
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseUserAttributes {
    name: string;
    email: string;
}
