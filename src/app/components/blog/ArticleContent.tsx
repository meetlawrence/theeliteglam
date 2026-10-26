import { BlogPost } from "./blogData";

interface ArticleContentProps {
  post: BlogPost;
}

export function ArticleContent({ post }: ArticleContentProps) {
  return (
    <div className="font-['Raleway',sans-serif] text-[#C2B89D] text-base sm:text-lg leading-[1.9] space-y-8 font-light max-w-3xl mx-auto">
      

      {post.content && post.content.length > 0 ? (
        post.content.map((paragraph, index) => (
          <p key={index} className="text-[#C2B89D] tracking-wide">
            {paragraph}
          </p>
        ))
      ) : (
        <p className="text-muted-foreground italic">
          Full story dispatches coming soon...
        </p>
      )}
    </div>
  );
}