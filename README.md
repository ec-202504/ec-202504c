# 🛍️ Tech Mate (C チーム)

## 🚀 Getting Started

まず、Notion の **「設定」ページ** を参考に設定を行う</br>
その後 WSL 上にリポジトリを clone し、以下のコマンド WSL 上で順番に実行。</br>
その際に node 22, Java Temurin 21 が存在することを確認

---

### 📂 ダミーデータを使用する場合

📄 `/backend/document/sql` 配下の SQL ファイルを順に実行

💡 **注意点:**  
`insert-book.sql` および `insert-pc.sql` を実行する前に、以下の依存ファイルを先に実行する必要がある

---

#### 📚 book 用の事前データ

- `insert-language.sql`
- `insert-purposeforbook.sql`

#### 💻 pc 用の事前データ

- `insert-cpus.sql`
- `insert-gpus.sql`
- `insert-oss.sql`
- `insert-purposeforpc.sql`

---

### 📦 必要なパッケージをインストール

```bash
make ready
```

### 🌐 フロントエンドサーバーの起動

```bash
make front
```

### 🔧 バックエンドサーバーの起動

※ バックエンドに変更を加えた際は、再起動が必要

```bash
make back
```

## 🛠️ その他便利コマンド

詳しくは Makefile を参照

### 🗄️ DB にアクセス

```bash
make psql
```

### 💣 DB コンテナを削除（ボリューム含む）

```bash
make down-v
```

### 🧹 フロントエンドの Lint チェック

```bash
make front-lint
```

### 🧼 バックエンドの Format + Lint チェック

```bash
make back-check
```
