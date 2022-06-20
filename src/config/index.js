import dotenv from "dotenv"

dotenv.config()


export const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET

export const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

export const DATABASE_URL = process.env.DATABASE_URL

export const MAX_API_REQUEST = process.env.MAX_API_REQUEST_COUNT

