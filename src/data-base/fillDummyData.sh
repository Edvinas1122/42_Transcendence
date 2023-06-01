#!/bin/bash

for i in {1..10}
do
   curl -X POST -H "Content-Type: application/json" -d "{\"name\":\"user_$i\", \"avatar\":\"asdas\", \"ImageLinks\":{}, \"FullName\":\"User $i\"}" http://localhost:3000/users/
done