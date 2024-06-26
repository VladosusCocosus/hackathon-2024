import {User} from "./user";

declare module 'hono' {

    interface ContextVariableMap {
        user: Omit<User, 'password'>
        jwtPayload: Omit<User, 'password'>
    }
}
