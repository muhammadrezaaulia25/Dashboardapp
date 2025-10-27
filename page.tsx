"use client"

import { useEffect, useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { UserTable } from "@/components/user-table"
import { Pagination } from "@/components/pagination"
import { fetchUsers } from "@/lib/api"
import type { User } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers()
        setUsers(data as User[])
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      const aValue = a[sortBy as keyof User]
      const bValue = b[sortBy as keyof User]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })

    return filtered
  }, [users, searchTerm, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredAndSortedUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">All Users</h1>
              <p className="text-muted-foreground">Browse and manage all users in the system</p>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 space-y-6">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : (
                <>
                  <UserTable users={paginatedUsers} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
