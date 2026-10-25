"use client";

import { useState } from "react";
import { BLOG_CATEGORIES, FEATURED_POST, BLOG_POSTS } from "../../components/blog/blogData";
import { BlogHeader } from "../../components/blog/BlogHeader";
import { FeaturedPost } from "../../components/blog/FeaturedPost";
import { BlogFilter } from "../../components/blog/BlogFilter";
import { BlogCard, BlogEmptyState } from "../../components/blog/BlogCard";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] pt-28 pb-32 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-16">
        <BlogHeader />

        <section className="space-y-4">
          <FeaturedPost post={FEATURED_POST} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-16 items-start">
          
          <aside className="lg:col-span-1 lg:sticky lg:top-32 space-y-6">
            <BlogFilter
              categories={BLOG_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </aside>

          <section className="lg:col-span-3">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-x-10 lg:gap-y-16 items-start">
                {filteredPosts.map((post, idx) => {
                  const isEven = idx % 2 === 1;
                  return (
                    <div
                      key={post.id}
                      className={`transition-all duration-500 ${
                        isEven ? "lg:translate-y-16" : ""
                      }`}
                    >
                      <BlogCard post={post} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <BlogEmptyState />
            )}
          </section>

        </div>

      </div>
    </main>
  );
}