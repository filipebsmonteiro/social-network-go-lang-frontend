import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UserRepository, { User } from "../../repositories/User/UserRepository";
import useAvatar from "../../hooks/useAvatar";
import Button from "../../components/ui/button/Button";
import { LoadingIcon, UserCircleIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SearchIcon } from "../../icons";


export default function UsersList() {
  const navigate = useNavigate();
  const { generateAvatar } = useAvatar();

  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const { data: users } = await UserRepository.fetchAll({ user: query });
        if (isMounted) {
          setUsers(users || []);
        }
      } catch (err) {
        console.error("Error fetching Users:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }, 1000); 

    return () => {
      clearTimeout(timeout);
      isMounted = false;
    };
  }, [query]);

  return (
    <>
      <PageMeta
        title="List of Users"
        description="This is the page that show all User List given a filter."
      />
      <PageBreadcrumb pageTitle="Followers List" />

      <form className="my-6" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
            {loading ? <LoadingIcon /> : <SearchIcon />}
          </span>
          <input
            type="text"
            placeholder="Search by typing here..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />

          <button
            className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
            type="submit"
          >
            <span> ⌘ </span>
            <span> Enter </span>
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {users.map((user) => (
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
