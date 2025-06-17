open:
	cd frontend && cursor .
	cd backend && idea64.exe .

front-ready:
	cd frontend && npm install

back-ready:
	cd backend && ./gradlew clean build

ready:
	make front-ready
	make back-ready

front:
	cd frontend && npm run dev

# テストを除いてビルド
build:
	cd backend && ./gradlew build -x test

# imageをビルドしてコンテナを起動
up:
	cd backend && docker compose up --build

# コンテナの停止・削除
down:
	cd backend && docker compose down

back:
	make build
	make up

# dockerのvolume(DBのデータ)も削除
down-v:
	cd backend && docker compose down -v

# postgreSQL操作
psql:
	cd backend && docker compose exec db psql -U postgres -d ec_site_playground

front-check:
	cd frontend && npx biome lint

back-check:
	cd backend && ./gradlew checkstyleMain