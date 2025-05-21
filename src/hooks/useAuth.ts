import { jwtDecode } from 'jwt-decode'
import UserRepository, { User } from '../repositories/User/UserRepository';
import { useEffect, useState } from 'react';

type DecodedToken = {
  authorized: boolean
  exp: number
  userId: number
}

const useAuth = () => {
  const token = localStorage.getItem("token")
  const [loggedUser, setLoggedUser] = useState<User | null>(null)
  const [decoded, setDecoded] = useState<DecodedToken | null>(null)

  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token)
      setDecoded(decodedToken)
    }
  }, [token])

  useEffect(() => {
    const loadUserData = async (id: string) => {
      try {
        const { data } = await UserRepository.fetch(id)
        setLoggedUser(data)
      } catch (error) {
        console.error("Failed to fetch logged user:", error)
      }
    }

    if (decoded?.userId) {
      loadUserData(decoded.userId.toString())
    }
  }, [decoded])


  const signIn = (token: string) => {
    localStorage.setItem("token", token);
    window.location.href = "/"; // or use useNavigate() in component
  };

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return {
    isAuthenticated,
    loggedUser,
    signIn,
    signOut,
  };
};

export default useAuth;
