import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";
import PostCard from "./PostCard";
import { LoadingIcon, PlusIcon } from "../../icons";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import CreateUpdatePost from "./CreateUpdatePost";
import Button from "../../components/ui/button/Button";
import { toast, ToastContentProps } from "react-toastify";

export default function PostsList() {
  const { isOpen, openModal, closeModal } = useModal();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [postEditing, setPostEditing] = useState<Post | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    const { data: posts } = await PostRepository.fetchAll();
    setPosts(posts || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const handleOpenModal = (id?: Post["id"]) => {
    let post = null;
    setPostEditing(post);
    if (id) {
      post = posts.find((post) => post.id === id) as Post;
    }
    setPostEditing(post);
    openModal();
  }

  const handleModalSave = async () => {
    setLoading(true);
    setPostEditing(null);
    closeModal();
    await loadPosts();
    setLoading(false);
  }


  const handleLike = async (id: Post["id"]) => {
    setLoading(true);
    setPosts(posts.map((post) => (post.id === id ? {...post, likes: post.likes + 1} : post)));
    setLoading(false);
  }

  const handleDislike = async (id: Post["id"]) => {
    setLoading(true);
    setPosts(posts.map((post) => (post.id === id ? {...post, likes: post.likes - 1} : post)));
    setLoading(false);
  }

  const handleDeleting = async (id: Post["id"]) => {
    setLoading(true);

    function ConfirmDelete({closeToast}: ToastContentProps) {
      return <div className="flex flex-col gap-2">
          Confirm Delete?
          <div className="flex gap-2">
            <Button variant="outline" size="xs" onClick={() => closeToast("cancel")}>Cancel</Button>
            <Button variant="error" size="xs" onClick={() => closeToast("delete")}>Delete</Button>
          </div>
        </div>
    }

    toast(ConfirmDelete, {
      autoClose: false,
      onClose(reason){
        switch (reason) {
          case "delete":
            PostRepository.delete(id);
            setPosts(posts.filter((post) => post.id !== id));
            toast.success("Post deleted successfully");
        }
      }
    })
    setLoading(false);
  }

  return (
    <>
      <PageMeta
        title="List of Posts"
        description="This is the page that show all Posts."
      />
      <PageBreadcrumb pageTitle="List of Posts" />

      <div className="space-y-6">
        {loading && <span className="flex gap-3"><LoadingIcon /> Loading...</span>}
        {
          !loading &&
            <>
              <Button startIcon={<PlusIcon />} onClick={handleOpenModal}>New Post</Button>
              {posts.map((post) => <PostCard
                key={post.id}
                post={post}
                onLikeClick={handleLike}
                onDislikeClick={handleDislike}
                onEditCLick={handleOpenModal}
                onDeleteClick={handleDeleting}
              />)}
            </>
        }

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
          <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                {postEditing ? "Editing" : "Creating"} Post
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Insert the Post details.
              </p>
            </div>
            <CreateUpdatePost
              post={postEditing}
              onCancel={() => {
                setPostEditing(null);
                closeModal();
              }}
              onSave={handleModalSave}
            />
          </div>
        </Modal>
      </div>
    </>
  );
}
