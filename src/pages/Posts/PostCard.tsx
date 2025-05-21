import React from "react";
import ComponentCard from "../../components/common/ComponentCard";
import { CalenderIcon, ThumbsDownIcon, ThumbsUpIcon } from "../../icons";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";


const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const handleLike = (id: number) => {
    post.likes++;
    PostRepository.like(id);
  }

  const handleDislike = (id: number) => {
    post.likes--;
    PostRepository.unlike(id);
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
  );
}

export default PostCard;
