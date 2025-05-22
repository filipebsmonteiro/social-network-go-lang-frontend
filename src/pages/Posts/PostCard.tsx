import React from "react";
import ComponentCard from "../../components/common/ComponentCard";
import { CalenderIcon, PencilIcon, ThumbsDownIcon, ThumbsUpIcon, TrashBinIcon } from "../../icons";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";
import useAuth from "../../hooks/useAuth";

type ComponentProps = {
  post: Post;
  onLikeClick?: (id: Post["id"]) => void;
  onDislikeClick?: (id: Post["id"]) => void;
  onEditCLick?: (id: Post["id"]) => void;
  onDeleteClick?: (id: Post["id"]) => void;
}


const PostCard: React.FC<ComponentProps> = ({ post, onLikeClick, onDislikeClick, onEditCLick, onDeleteClick }) => {
  const { loggedUser } = useAuth();
  
  const handleLike = async (id: number) => {
    await PostRepository.like(id);
    onLikeClick?.(id);
  }

  const handleDislike = async (id: number) => {
    await PostRepository.unlike(id);
    onDislikeClick?.(id);
  }

  return (
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
        <div className="flex items-center justify-between gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
          <span className="flex gap-3 items-center">
            Likes: {post.likes}
            <ThumbsUpIcon className="cursor-pointer w-5 h-5 text-success-500" onClick={() => handleLike(post.id)} />
            <ThumbsDownIcon className="cursor-pointer w-5 h-5 text-error-500" onClick={() => handleDislike(post.id)} />
          </span>
          {loggedUser?.id === post.authorId && <span className="flex gap-3 items-center">
            <PencilIcon className="cursor-pointer w-5 h-5 text-blue-500" onClick={() => onEditCLick?.(post.id)} />
            <TrashBinIcon className="cursor-pointer w-5 h-5 text-error-500" onClick={() => onDeleteClick?.(post.id)} />
          </span>}
        </div>
      }
    >
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {post.content}
      </p>
    </ComponentCard>
  );
}

export default PostCard;
