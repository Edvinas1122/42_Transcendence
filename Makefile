all:
	docker-compose up --build

shell_back:
	docker-compose exec nest-app bash

shell_front:
	docker-compose exec next-app bash

wipe_db:
	docker volume rm 42_transcendence_pgadmin_data

stop:
	docker-compose down

clean:
	docker-compose down --rmi all

clear:
	docker-compose down --rmi all --volumes --remove-orphans

wipe_js:
	rm src/server-side/app/src/*.js
	rm src/server-side/app/src/**/*.js