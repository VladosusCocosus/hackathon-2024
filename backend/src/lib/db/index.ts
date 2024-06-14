import pg from 'pg'



export const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.MAX_CONNECTIONS) ?? 10
})
