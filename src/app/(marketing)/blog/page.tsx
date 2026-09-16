import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog | Plinth",
  description: "Latest news, updates, and guides from the Plinth team.",
};

const posts = [
  {
    slug: "introducing-plinth",
    title: "Introducing Plinth: The Ultimate SaaS Starter",
    description: "Learn how Plinth can help you build production-ready SaaS applications faster.",
    date: "2026-03-12",
    author: "Plinth Team",
    tags: ["announcement", "saas", "nextjs"],
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-4xl font-bold">Blog</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Latest news, updates, and guides from the Plinth team.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{post.date}</Badge>
                    <span className="text-sm text-muted-foreground">
                      by {post.author}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <CardDescription>{post.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
