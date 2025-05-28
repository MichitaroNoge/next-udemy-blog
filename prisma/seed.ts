import { PrismaClient } from "../src/generated/prisma";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();

  const hashedPassword = await bcrypt.hash("123456", 10);

  // ダミー画像
  const dummyImages = [
    "https://picsum.photos/seed/post1/600/400",
    "https://picsum.photos/seed/post2/600/400",
  ];

  // ユーザー作成
  const user = await prisma.user.create({
    data: {
      email: "k3wTb@example.com",
      name: "John Doe",
      password: hashedPassword,
      posts: {
        create: [
          {
            title: `初めてのブログ投稿`,
            content: `これは初めてのブログ投稿です。`,
            topImage: dummyImages[1],
            published: true,
          },
          {
            title: `2回目のブログ投稿`,
            content: `これは2回目のブログ投稿です。`,
            topImage: dummyImages[1],
            published: true,
          },
        ],
      },
    },
  });
  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
