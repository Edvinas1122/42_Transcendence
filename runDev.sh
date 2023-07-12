#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
    # MacOS system
    sed -i '' '/^CMD/c\
    CMD ["npm", "run", "start:dev"]
    ' src/client-side/Dockerfile
else
    # Assume Linux
    sed -i '/^CMD/c\
    CMD ["npm", "run", "dev"]
    ' src/client-side/Dockerfile
fi