const useAuth = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token ? true : false;

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
    token,
    signIn,
    signOut,
  };
};

export default useAuth;