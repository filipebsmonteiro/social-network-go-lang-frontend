import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";
import PostCard from "./PostCard";
import { LoadingIcon } from "../../icons";

export default function PostsList() {

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
        {
          loading
            ? <span className="flex gap-3"><LoadingIcon /> Loading...</span> 
            : posts.map((post) => <PostCard key={post.id} post={post} />)
        }
      </div>
    </>
  );
}
