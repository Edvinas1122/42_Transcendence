all:
	docker-compose up --build

shell_back:
	docker-compose exec nest-app bash

stop:
	docker-compose down