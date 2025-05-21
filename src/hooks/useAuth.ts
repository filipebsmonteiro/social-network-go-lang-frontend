import { jwtDecode } from 'jwt-decode'

const useAuth = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;
  let decoded: {
    authorized: boolean
    exp: number
    userId: number
  } | null = null;

  if (token) {
    decoded = jwtDecode(token);
  }

  const signIn = (token: string) => {
    localStorage.setItem("token", token);
    window.location.href = "/"; // or use useNavigate() in component
  };

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return {
    loggedUserId: decoded?.userId,
    isAuthenticated,
    token,
    signIn,
    signOut,
  };
};

export default useAuth;
