import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import useAvatar from "../../hooks/useAvatar";
import { CalenderIcon, ThumbsDownIcon, ThumbsUpIcon } from "../../icons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";
import PostCard from "./PostCard";

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

  

  return (
    <>
      <PageMeta
        title="List of Posts"
        description="This is the page that show all Posts."
      />
      <PageBreadcrumb pageTitle="List of Posts" />

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
