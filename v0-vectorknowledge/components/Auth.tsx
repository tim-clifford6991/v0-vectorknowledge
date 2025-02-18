import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"

export default function Auth() {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  return (
    <div>
      {!isAuthenticated ? (
        <Button onClick={() => loginWithRedirect()}>Log In</Button>
      ) : (
        <Button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</Button>
      )}
    </div>
  )
}

