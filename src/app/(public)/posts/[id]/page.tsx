import { notFound } from "next/navigation";
import { getPost } from "@/lib/post";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ja } from "date-fns/locale";
import { format } from "date-fns";

type Params = {
  params: { id: string };
};

export default async function PostPage(props: {
  params: Promise<Params["params"]>;
}) {
  const { id } = await props.params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        {post.topImage && (
          <div className="relative w-full h-64 lg:h-96">
            <Image
              src={post.topImage}
              alt={post.title}
              fill
              sizes="100vw"
              className="rounded-t-xl object-cover"
              priority
            />
          </div>
        )}
        <CardHeader>
          <div>
            <p className="text-sm text-gray-500">投稿者： {post.author.name}</p>
            <time className="text-sm text-gray-500">
              {format(new Date(post.createdAt), "yyyy年MM月dd日", {
                locale: ja,
              })}
            </time>
          </div>
          <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-2">{post.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
