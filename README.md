# 🛍️ EC-Site C チーム

## 🚀 Getting Started

まず、Notion の **「設定」ページ** を参考に設定を行う</br>
その後 WSL 上にリポジトリを clone し、以下のコマンド WSL 上で順番に実行。

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
