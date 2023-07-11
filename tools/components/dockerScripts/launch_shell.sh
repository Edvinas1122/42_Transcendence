#launch container with shared directory on host on ./data directory and launch shell
docker run -it -v $(pwd)/app/src:/app/src -p 3000:3000 transcendence /bin/bash