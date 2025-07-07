# Finote - 家計簿管理アプリ 開発ドキュメント

## プロジェクト概要

**プロジェクト名**: Finote（ファイノート）  
**概要**: 個人の家計簿管理をデジタル化する Web アプリケーション  
**目標**: AI を駆使した高速開発で、既存 Excel 管理からのシステム化を実現

## 技術選定

### フロントエンド・バックエンド

-   **Next.js 15** (App Router) - フルスタック開発
-   **TypeScript** - 型安全性の確保
-   **Turbopack** - 高速な開発サーバー

### データベース・ORM

-   **PostgreSQL** - 高機能なリレーショナルデータベース
-   **Prisma ORM** - TypeScript 完全対応の ORM

### 開発環境

-   **Docker + Docker Compose** - 開発環境の統一
-   **pnpm** - 高速パッケージマネージャー

## 機能要件

### Phase 1: 基本機能（優先実装）

#### 1. 基本収支管理

-   **収入管理**: カテゴリー別の収入記録（給与、副業、投資収益など）
-   **支出管理**: カテゴリー別の支出記録（食費、光熱費、娯楽費など）
-   **取引詳細**: 具体的な収支内容の記述機能
-   **日付管理**: 取引日の記録と月次集計

#### 2. 予算・計画管理

-   **予算設定**: カテゴリー別予算設定
-   **イベント予算**: 旅行等の特別予算管理
-   **買い物メモ**: 商品名、価格、メモの記録
-   **固定費設定**: 定期的な支出の自動計算

#### 3. 資産・負債管理

-   **投資損益**: 投資の購入価格、現在価値、損益計算
-   **ローン管理**: 借入金額、返済計画、完済予定日
-   **ポイント管理**: 各種ポイントの残高一覧

#### 4. 分析・可視化

-   **月次残高**: 収入-支出の月次推移
-   **支出分析**: カテゴリー別支出グラフ（円グラフ、棒グラフ）
-   **予算対実績**: 予算 vs 実際の支出比較
-   **トレンド分析**: 月次・年次の推移グラフ

### Phase 2: 拡張機能（後回し）

-   レシート読み取り機能
-   通知機能
-   高度な分析機能

## 開発環境構築

### 1. 必要なツール

-   Node.js 18.x 以上
-   pnpm
-   Docker & Docker Compose
-   Git

### 2. 初期セットアップ

```bash
# プロジェクトクローン
git clone <repository-url>
cd finote

# 依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env
# .envファイルを適切に設定

# データベース起動
pnpm run docker:up

# Prismaセットアップ
pnpm run db:generate
pnpm run db:push
```

## pnpm コマンド一覧

### 基本コマンド

```bash
# 開発サーバー起動（Turbopack使用）
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# リント実行
pnpm lint
```

### Docker 関連コマンド

```bash
# 全サービス起動
pnpm run docker:up

# データベースのみ起動
pnpm run db:up

# 全サービス停止
pnpm run docker:down

# データベースのみ停止
pnpm run db:down

# ログ確認
pnpm run docker:logs
```

### データベース関連コマンド

```bash
# Prismaクライアント生成
pnpm run db:generate

# データベーススキーマ同期
pnpm run db:push

# マイグレーション実行
pnpm run db:migrate

# Prisma Studio起動（データベースGUI）
pnpm run db:studio

# データベースシード実行
pnpm run db:seed
```

### パッケージ管理コマンド

```bash
# パッケージ追加
pnpm add <package-name>

# 開発依存関係追加
pnpm add -D <package-name>

# パッケージ削除
pnpm remove <package-name>

# 依存関係更新
pnpm update
```

## 環境変数設定

### .env ファイル

```env
# Database
DATABASE_URL="postgresql://finote_user:finote_password@localhost:5432/finote"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

## Docker 構成

### docker-compose.yml

-   **PostgreSQL**: メインデータベース（ポート 5432）
-   **pgAdmin**: データベース管理 GUI（ポート 5050）
-   **Redis**: キャッシュ用（ポート 6379）

### データベース接続情報

-   **Host**: localhost
-   **Port**: 5432
-   **Database**: finote
-   **Username**: finote_user
-   **Password**: finote_password

## 開発フロー

### 1. 日常開発

```bash
# 1. データベース起動
pnpm run docker:up

# 2. 開発サーバー起動
pnpm dev

# 3. ブラウザで確認
# http://localhost:3000
```

### 2. データベース変更時

```bash
# 1. schema.prismaを編集
# 2. マイグレーション作成・実行
pnpm run db:migrate

# 3. クライアント再生成
pnpm run db:generate
```

### 3. 本番デプロイ前

```bash
# 1. ビルド確認
pnpm build

# 2. テスト実行
pnpm test

# 3. リント確認
pnpm lint
```

## 注意事項

### Git 管理

-   `.env`ファイルは`.gitignore`に追加済み
-   `docker/volumes/`、`docker/logs/`、`docker/data/`は管理対象外
-   `prisma/migrations/`は管理対象外

### 開発時の注意点

-   Turbopack は Next.js 15 で安定しているが、一部のプラグインで互換性問題がある可能性
-   pnpm を使用しているため、`node_modules`の構造が異なる
-   Docker コンテナ使用時は、ポートの競合に注意

---

**更新日**: 2025-07-07  
**バージョン**: 1.0.0
