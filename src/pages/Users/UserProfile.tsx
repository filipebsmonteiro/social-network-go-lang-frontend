import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserRepository, { User } from "../../repositories/User/UserRepository";
import useAvatar from "../../hooks/useAvatar";
import { useParams } from "react-router-dom";
import Button from "../../components/ui/button/Button";
import { UserCircleIcon } from "../../icons";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import PostCard from "../Posts/PostCard";
import { Post } from "../../repositories/Post/PostRepository";

export default function UserProfile() {
  const { generateAvatar } = useAvatar();
  const { id } = useParams();
  const { loggedUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [followings, setFollowings] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [userRes, followersRes, followingsRes, postsRes] = await Promise.allSettled([
          UserRepository.fetch(id),
          UserRepository.followers(id),
          UserRepository.following(id),
          UserRepository.posts(id),
        ]);

        if (userRes.status === 'fulfilled') {
          setUser(userRes.value.data);
        }
        if (followersRes.status === 'fulfilled') {
          setFollowers(followersRes.value.data || []);
        }
        if (followingsRes.status === 'fulfilled') {
          setFollowings(followingsRes.value.data || []);
        }
        if (postsRes.status === 'fulfilled') {
          setPosts(postsRes.value.data || []);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchData();
  }, [id]);

  const [isFollower, setIsFollower] = useState<boolean>(false);
  useEffect(() => {
    setIsFollower(followers.some((follower) => follower.id === loggedUser?.id));
  }, [followers, loggedUser]);

  const relationHandler = async () => {
    if (!user) return;
    if (isFollower) {
      await UserRepository.unFollow(user.id);
      setFollowers(followers.filter((follower) => follower.id !== loggedUser?.id));
    } else {
      await UserRepository.follow(user.id);
      setFollowers([...followers, loggedUser as User]);
    }
  };

  if (!user) return <div>Loading...</div>;

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
              {isFollower}
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
              variant={ isFollower ? 'error' : 'success' }
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

          <h4 className="mb-1 font-medium text-gray-800 text-theme-xl dark:text-white/90">Posts</h4>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

        </ComponentCard>
      </div>
    </>
  );
}
