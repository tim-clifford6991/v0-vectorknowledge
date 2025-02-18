import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client"
import Navigation from "@/components/Navigation"
import Chat from "@/components/Chat"

function Dashboard() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard, {user?.name}!</h1>
        <Chat />
      </main>
    </div>
  )
}

export default withPageAuthRequired(Dashboard)

