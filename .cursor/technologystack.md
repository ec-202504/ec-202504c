---
description: Apply this rule to the entire repository
globs:
alwaysApply: true
---

このリポジトリで採用している主要技術・ライブラリ一覧です。
※バージョンアップや追加・削除を行う場合は必ず事前承認を取ること。

---

## Frontend

- **React** (`react@19.1.0`, `react-dom@19.1.0`)
  - UI ライブラリ
- **TypeScript** (`typescript@~5.8.3`)
  - 静的型付け
- **Vite** (`vite@6.3.5`)
  - フロントエンドビルドツール
- **TanStack Router** (`@tanstack/react-router@1.120.11`)
  - SPA ルーティング
- **React Hook Form** (`react-hook-form@7.57.0`)
  - フォームバリデーション
- **Zod** (`zod@3.25.58`)
  - スキーマバリデーション
- **Axios** (`axios@1.9.0`)
  - API 通信
- **date-fns** (`date-fns@4.1.0`)
  - 日付処理
- **shadcn/ui**
  - UI コンポーネント
- **Tailwind CSS** (`tailwindcss@4.1.7`, `@tailwindcss/vite@4.1.7`)
  - ユーティリティ CSS

### 開発/検証

- **Biome** (`@biomejs/biome@1.9.4`)
  - Lint/Format 統合ツール

---

## Backend

- **Java** `21`
  - メインプログラミング言語
- **Spring Boot** (`org.springframework.boot`)
  - アプリケーションフレームワーク
- **Spring Security** (`org.springframework.boot:spring-boot-starter-security`)
  - 認証・認可
- **Spring Validation** (`org.springframework.boot:spring-boot-starter-validation`)
  - 入力値バリデーション
- **Spring Data JPA** (`org.springframework.boot:spring-boot-starter-data-jpa`)
  - ORM, データベースアクセス
- **Spring Web** (`org.springframework.boot:spring-boot-starter-web`)
  - REST API 開発
- **Spring Mail** (`org.springframework.boot:spring-boot-starter-mail`)
  - メール送信
- **PostgreSQL** (`org.postgresql:postgresql` version 17)
  - RDBMS
- **Lombok** (`org.projectlombok:lombok`)
  - コード自動生成
- **JUnit** (`org.junit.platform:junit-platform-launcher`)
  - テスト

### 開発/品質管理

- **Spotless**
  - Java コードフォーマッター
- **Checkstyle**
  - Java コードスタイルチェッカー

---

## 注意事項

- 依存パッケージのバージョンは**package.json・build.gradle に準拠**
- **追加・削除・アップグレードは必ず事前相談・承認必須**

---

## 参考

- `package.json`（フロントエンド依存）
- `build.gradle`（バックエンド依存）
