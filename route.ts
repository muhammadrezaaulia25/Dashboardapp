// Login API endpoint
import { generateToken } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

// Mock user credentials
const VALID_USERNAME = "testuser"
const VALID_PASSWORD = "testpass"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const token = await generateToken("1", username)
      return NextResponse.json(
        {
          token,
          user: { id: "1", username },
        },
        { status: 200 },
      )
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
