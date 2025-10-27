"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { UserEditForm } from "@/components/user-edit-form"
import { Button } from "@/components/ui/button"
import { fetchUserById } from "@/lib/api"
import type { User } from "@/lib/types"

export default function UserEditPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.id)

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserById(userId)
        setUser(userData as User)
      } catch (err) {
        setError("Failed to load user data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [userId])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading user data...</p>
          </main>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || "User not found"}</p>
              <Link href="/users">
                <Button>Back to Users</Button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Link href={`/users/${user.id}`}>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to User
              </Button>
            </Link>

            <UserEditForm user={user} />
          </div>
        </main>
      </div>
    </div>
  )
}
