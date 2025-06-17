open:
	cd frontend && cursor .
	cd backend && idea64.exe .

front-ready:
	npm install && cd frontend && npm install

back-ready:
	cd backend && ./gradlew clean build

ready:
	make front-ready
	make back-ready

front:
	cd frontend && npm run dev

# テストを除いてビルド
build:
	cd backend && ./gradlew build -x test -x checkstyleMain

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
	cd backend && docker compose exec db psql -U postgres -d ec_site

front-lint:
	cd frontend && npx biome lint

back-format:
	cd backend && ./gradlew spotlessApply

back-lint:
	cd backend && ./gradlew checkstyleMain

back-check:
	make back-format
	make back-lint