"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard or login based on auth token
    const token = document.cookie.includes("auth-token")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
