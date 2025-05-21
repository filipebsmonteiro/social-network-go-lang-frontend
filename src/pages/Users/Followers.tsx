import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserRepository, { User } from "../../repositories/User/UserRepository";
import useAvatar from "../../hooks/useAvatar";
import Button from "../../components/ui/button/Button";
import { UserCircleIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";


export default function Followers() {
  const navigate = useNavigate();
  const { generateAvatar } = useAvatar();
  const { loggedUser } = useAuth();

  const [followers, setFollowers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loggedUser) return;
      try {
        const { data: followers } = await UserRepository.followers(loggedUser.id);

        setFollowers(followers || []);
      } catch (err) {
        console.error("Error fetching Followers:", err);
      }
    };

    fetchData();
  }, [loggedUser]);

  return (
    <>
      <PageMeta
        title="List of Followers"
        description="This is the page that show the User Followers List."
      />
      <PageBreadcrumb pageTitle="Followers List" />
      <div className="space-y-6">
        {followers.map((user) => (
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
