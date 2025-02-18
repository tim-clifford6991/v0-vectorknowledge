import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const { user, isLoading } = useUser()

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <Link href="/" className="text-lg font-bold">
        AI Knowledge Base
      </Link>
      <div>
        {!isLoading && (
          <>
            {user ? (
              <>
                <span className="mr-4">Welcome, {user.name}!</span>
                <Link href="/api/auth/logout">
                  <Button>Log Out</Button>
                </Link>
              </>
            ) : (
              <Link href="/api/auth/login">
                <Button>Log In</Button>
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  )
}

