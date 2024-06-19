import {db} from "../../lib/db";
import {crypto} from "../../lib/crypto";
import {User} from "../../types/user";

export class AuthController {
    async createUser (user: Omit<User, 'id'>): Promise<User> {
        const passwordHash = await crypto.generateHash(user.password)

        const {rows} = await db.query<User>("insert into users (name, password, email) values ($1, $2, $3) returning name, email, id", [user.name, passwordHash, user.email])
        return rows?.[0]
    }

    async getUserByEmail (email: string): Promise<User | undefined> {
        const userResponse = await db.query<User>('select * from users where email = $1', [email])

        return userResponse.rows?.[0] ?? undefined
    }
}
