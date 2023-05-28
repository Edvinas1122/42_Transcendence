all:
	docker-compose up --build

shell_back:
	docker-compose exec nest-app bash

shell_front:
	docker-compose exec next-app bash

stop:
	docker-compose down