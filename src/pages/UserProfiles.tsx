import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import { toast, ToastContentProps } from "react-toastify";
import Button from "../components/ui/button/Button";
import UserRepository from "../repositories/User/UserRepository";
import useAuth from "../hooks/useAuth";

export default function UserProfiles() {
  const { loggedUser, signOut } = useAuth();
  const handleUserDelete = async () => {
    function ConfirmDelete({closeToast}: ToastContentProps) {
      return <div className="flex flex-col gap-2 w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Confirm User Delete?
          </h3>
          <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">This action can't be undone.</p>

          <div className="flex gap-2">
            <Button variant="outline" size="xs" className="flex-1" onClick={() => closeToast("cancel")}>Cancel</Button>
            <Button variant="error" size="xs" className="flex-1" onClick={() => closeToast("delete")}>Delete</Button>
          </div>
        </div>
    }

    toast(ConfirmDelete, {
      autoClose: false,
      async onClose(reason){
        if (reason === "delete") {
            await UserRepository.delete(loggedUser?.id as number);
            signOut();
            toast.success("Account deleted successfully, wait to be redirected to login page", {
              autoClose: 4000,
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 4000);
        }
      }
    })
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />

          <Button variant="error" onClick={handleUserDelete}>Delete Account</Button>
        </div>
      </div>
    </>
  );
}
