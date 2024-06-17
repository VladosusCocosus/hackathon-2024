import {Context} from "hono";
import {getCookie} from "hono/cookie";
import {lucia} from "../lucia";

export async function getUser(c: Context) {
    const cookie = getCookie(c)
    const authSession = cookie["auth_session"]
    const {user} = await lucia.validateSession(authSession)
    return user
}
