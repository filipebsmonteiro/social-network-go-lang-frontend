import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import useAvatar from "../../hooks/useAvatar";
import { CalenderIcon, ThumbsDownIcon, ThumbsUpIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";

export default function PostsList() {
  const navigate = useNavigate();
  const { generateAvatar } = useAvatar();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const { data: posts } = await PostRepository.fetchAll();
        if (isMounted) {
          setPosts(posts || []);
        }
      } catch (err) {
        console.error("Error fetching Posts:", err);
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
  }, []);

  const handleLike = (id: number) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    PostRepository.like(id);
  }

  const handleDislike = (id: number) => {
    const updatedPosts = posts.map((post) => {
      if(post.id === id){
        return {...post, likes: post.likes - 1}
      }
      return post;
    });
    setPosts(updatedPosts);
    PostRepository.unlike(id);
  }

  return (
    <>
      <PageMeta
        title="List of Posts"
        description="This is the page that show all Posts."
      />
      <PageBreadcrumb pageTitle="List of Posts" />

      <div className="space-y-6">
        {posts.map((post) => (
          <ComponentCard
            key={post.id}
            title={post.title}
            headerEnd={
              <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                <CalenderIcon />
                {Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(post.createdAt))}
              </span>
            }
            footer={
              <div className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                <span className="flex gap-3 items-center">
                  Likes: {post.likes}
                  <ThumbsUpIcon className="cursor-pointer w-5 h-5 text-success-500" onClick={() => handleLike(post.id)} />
                  <ThumbsDownIcon className="cursor-pointer w-5 h-5 text-error-500" onClick={() => handleDislike(post.id)} />
                </span>
              </div>
            }
          >
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {post.content}
            </p>
          </ComponentCard>
        ))}
      </div>
    </>
  );
}
