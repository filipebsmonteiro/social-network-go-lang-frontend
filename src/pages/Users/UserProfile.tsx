import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserRepository, { User } from "../../repositories/User/UserRepository";
import useAvatar from "../../hooks/useAvatar";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import { UserCircleIcon } from "../../icons";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";

export default function UserProfile() {
  const { generateAvatar } = useAvatar();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loggedUserId } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [followings, setFollowings] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('id :>> ', id);
      if (!id) return;
      try {
        const { data: user } = await UserRepository.fetch(`${id}`);
        const { data: followers } = await UserRepository.followers(`${id}`);
        const { data: followings } = await UserRepository.following(`${id}`);

        setUser(user);
        setFollowers(followers || []);
        setFollowings(followings || []);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchData();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  const isFollower = followers.some((follower) => follower.id.toString() === loggedUserId?.toString());

  const relationHandler = async () => {
    if (isFollower) {
      await UserRepository.unFollow(user.id);
      setFollowers(followers.filter((follower) => follower.id !== user.id));
    } else {
      await UserRepository.follow(user.id);
      setFollowers([...followers, user]);
    }
  };

  return (
    <>
      <PageMeta
        title="User Profile"
        description="This is the page that show the User Profile."
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="space-y-6">
        <ComponentCard key={user.id} title={user.name}>
          <div className="flex gap-4">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={generateAvatar()}
                alt={user.name + ' avatar'}
              />
            </div>
            <div className="flex items-center gap-3">
              <div>
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  @{user.nick}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {user.email}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="primary"
              className="ml-auto"
              onClick={relationHandler}
              startIcon={<UserCircleIcon />}
            >{ isFollower ? 'Unfollow' : 'Follow' }</Button>
          </div>

          <div className="flex">
            <div className="basis-6/12">
              <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                Followers:
              </span>
              <div className="flex -space-x-2">
                {followers.map((follower, index) => (
                  <div
                    key={index}
                    className="h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                  >
                    <img
                      width={24}
                      height={24}
                      src={generateAvatar()}
                      alt={`Follower ${follower.name} avatar`}
                      className="w-full size-6"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="basis-6/12">
              <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                Followers:
              </span>
              <div className="flex -space-x-2">
                {followings.map((following, index) => (
                  <div
                    key={index}
                    className="h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                  >
                    <img
                      width={24}
                      height={24}
                      src={generateAvatar()}
                      alt={`Following ${following.name} avatar`}
                      className="w-full size-6"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </ComponentCard>
      </div>
    </>
  );
}
