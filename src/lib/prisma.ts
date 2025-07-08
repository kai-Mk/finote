import { PrismaClient } from '@prisma/client';

// Prismaクライアントのシングルトンパターン
// 開発環境でホットリロード時にコネクションが増えすぎるのを防ぐ

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'], // 開発環境でクエリログを表示
  });

// 開発環境では、グローバルオブジェクトにPrismaクライアントを保存
// これにより、ホットリロード時に新しいインスタンスが作られるのを防ぐ
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
