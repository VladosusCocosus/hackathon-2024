import bcrypt from 'bcryptjs'

class Crypto {
    async generateHash (input: string): Promise<string> {
        return await bcrypt.hash(input, 8)
    }

    async compare (input: string, password: string): Promise<boolean> {
        return await bcrypt.compare(input, password)
    }
}

export const crypto = new Crypto()
