import { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import PostRepository, { Post } from "../../repositories/Post/PostRepository";
import { toast } from "react-toastify";

type ComponentProps = {
  post: Post | null;
  onCancel?: () => void;
  onSave?: () => void
};

export default function CreateUpdatePost({ post, onCancel, onSave }: ComponentProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = async () => {
    try {
      if (post) {
        await PostRepository.update(post.id, { title, content });
      } else {
        await PostRepository.create({ title, content });
      }
      onSave?.();
      toast.success("Post saved successfully");
    } catch (_error) {
      toast.error("Error saving post");
    }
  };

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  return (
    <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
      <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div>
          <Label>Content</Label>
          <TextArea
            value={content}
            onChange={(value) => setContent(value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSubmit}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}