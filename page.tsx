"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, Globe, Building2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PostList } from "@/components/post-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchUserById, fetchPostsByUserId } from "@/lib/api"
import type { User, Post } from "@/lib/types"

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.id)

  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserById(userId)
        setUser(userData as User)

        const postsData = await fetchPostsByUserId(userId)
        setPosts(postsData as Post[])
      } catch (err) {
        setError("Failed to load user data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading user details...</p>
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
          <div className="max-w-4xl mx-auto space-y-6">
            <Link href="/users">
              <Button variant="outline" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Users
              </Button>
            </Link>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>@{user.username}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <p className="font-medium">{user.website}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{user.company.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {user.address.street}, {user.address.suite}
                      <br />
                      {user.address.city}, {user.address.zipcode}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h4 className="font-semibold mb-2">Company Details</h4>
                    <p className="text-sm text-muted-foreground mb-1">{user.company.catchPhrase}</p>
                    <p className="text-sm text-muted-foreground">{user.company.bs}</p>
                  </div>

                  <div className="pt-4">
                    <Link href={`/users/${user.id}/edit`}>
                      <Button>Edit User</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Posts</CardTitle>
                  <CardDescription>{posts.length} posts published</CardDescription>
                </CardHeader>
                <CardContent>
                  <PostList posts={posts} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
