sed -i '' '/^CMD/c\
CMD ["npm", "run", "start:dev"]
' src/server-side/Dockerfile

sed -i '' '/^CMD/c\
CMD ["npm", "run", "dev"]
' src/client-side/Dockerfile