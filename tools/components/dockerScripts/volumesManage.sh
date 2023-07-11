# see volumes
docker volume ls

# remove all volumes
docker volume rm $(docker volume ls -q)

# inspect specific volume
docker volume inspect <volume-name>