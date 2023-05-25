#!/bin/bash

# Run the Docker command and capture the output
output=$(docker ps --filter "ancestor=trance_front_end")

# Extract the container ID from the output using pattern matching
container_id=$(echo "$output" | awk 'NR==2{print $1}')

# Print the container ID
echo "Front_end Container ID: $container_id"


docker stop $container_id