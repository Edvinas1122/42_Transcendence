#!/bin/bash

if [[ "$OSTYPE" == "darwin"* ]]; then
    # MacOS system
    sed -i '' '/^CMD/c\
    CMD ["npm", "run", "start"]
    ' src/client-side/Dockerfile
else
    # Assume Linux
    sed -i '/^CMD/c\
    CMD ["npm", "run", "start"]
    ' src/client-side/Dockerfile
fi