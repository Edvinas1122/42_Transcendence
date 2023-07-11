sed -i '' '/^CMD/c\
CMD ["npm", "run", "start"]
' src/server-side/Dockerfile

sed -i '' '/^CMD/c\
CMD ["npm", "run", "start"]
' src/client-side/Dockerfile