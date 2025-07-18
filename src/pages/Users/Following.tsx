import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserRepository, { User } from "../../repositories/User/UserRepository";
import useAvatar from "../../hooks/useAvatar";
import Button from "../../components/ui/button/Button";
import { UserCircleIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Following() {
  const navigate = useNavigate();
  const { generateAvatar } = useAvatar();
  const { loggedUser } = useAuth();

  const [followings, setFollowings] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loggedUser) return;
      try {
        const { data: followings } = await UserRepository.following(loggedUser.id);

        setFollowings(followings || []);
      } catch (err) {
        console.error("Error fetching Followings:", err);
      }
    };

    fetchData();
  }, [loggedUser]);

  return (
    <>
      <PageMeta
        title="List of Following"
        description="This is the page that show the User Following List."
      />
      <PageBreadcrumb pageTitle="Following List" />
      <div className="space-y-6">
        {followings.map((user) => (
          <ComponentCard key={user.id} title={user.name}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden rounded-full">
                <img
                  width={40}
                  height={40}
                  src={generateAvatar()}
                  alt={user.name + ' avatar'}
                />
              </div>
              <div>
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  @{user.nick}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => { navigate(`/users/${user.id}/profile`)}}
                startIcon={<UserCircleIcon />}
              >Profile</Button>
            </div>
          </ComponentCard>
        ))}
      </div>
    </>
  );
}
