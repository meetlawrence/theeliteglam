"use client";

import { useState } from "react";
import { BLOG_CATEGORIES, FEATURED_POST, BLOG_POSTS } from "./blogData";
import { BlogHeader } from "./BlogHeader";
import { FeaturedPost } from "./FeaturedPost";
import { BlogFilter } from "./BlogFilter";
import { BlogCard, BlogEmptyState } from "./BlogCard";

export default function BlogSection() {
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
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        <BlogHeader />

        <FeaturedPost post={FEATURED_POST} />

        <BlogFilter
          categories={BLOG_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <section>
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <BlogEmptyState />
          )}
        </section>
      </div>
    </main>
  );
}