import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import useAuth from "../../hooks/useAuth";

export default function SignIn() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    window.location.href = "/";
  }

  return (
    <>
      <PageMeta
        title="SignIn Page"
        description="SignIn Page"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
