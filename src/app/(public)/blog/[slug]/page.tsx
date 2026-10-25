import { BLOG_POSTS } from "../../../components/blog/blogData";
import { ArticleNav, ArticleFooterNav } from "../../../components/blog/ArticleNav";
import { ArticleHeader } from "../../../components/blog/ArticleHeader";
import { ArticleHeroImage } from "../../../components/blog/ArticleHeroImage";
import { ArticleContent } from "../../../components/blog/ArticleContent";
import { ArticleGallery } from "../../../components/blog/ArticleGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug) || BLOG_POSTS[0];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] pt-28 pb-20 px-4 sm:px-6 lg:px-8">

      <article className="max-w-4xl mx-auto space-y-10 sm:space-y-12">

        <ArticleNav />

        <ArticleHeader post={post} />

        <ArticleHeroImage image={post.image} title={post.title} />

        <div className="max-w-3xl mx-auto space-y-8">
          <ArticleContent post={post} />

          {post.gallery && post.gallery.length > 0 && (
            <ArticleGallery images={post.gallery} title={post.title} />
          )}
        </div>

        <div className="max-w-3xl mx-auto pt-6">
          <ArticleFooterNav readTime={post.readTime} />
        </div>

      </article>
    </main>
  );
}