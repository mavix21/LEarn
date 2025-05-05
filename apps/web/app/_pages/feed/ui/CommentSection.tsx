import { MessageCircle } from "lucide-react";

interface CommentSectionProps {
  postId: string;
  showInput: boolean;
  handleInput: (show: boolean) => void;
}

export function CommentSection({
  postId,
  showInput,
  handleInput,
}: CommentSectionProps) {
  // Puedes seguir usando los hooks para comentarios si los necesitas
  // const comments = useQuery(api.comments.getComments, {
  //   postId: postId as Id<"posts">,
  // });
  // const createComment = useMutation(api.comments.createComment);

  return (
    <button
      onClick={() => handleInput(!showInput)}
      className={`flex items-center transition-colors hover:text-blue-500 ${
        showInput ? "fill-blue-500 text-blue-500" : "text-muted-foreground"
      }`}
      type="button"
      aria-label="Comentar"
    >
      <MessageCircle size={20} />
    </button>
  );
}
