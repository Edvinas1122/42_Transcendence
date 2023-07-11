if [ -z "$1" ]
then
  IP=$(ifconfig | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" | sed -n '2p')
else
  IP=$1
fi
NEXT_PUBLIC_FRONTEND_API_BASE_URL="http://$IP:3030/"
NEXT_PUBLIC_BACKEND_API_BASE_URL="http://$IP:3000"
NEXT_PUBLIC_HOST_NAME="$IP"
INTRA_UID=$(grep ^INTRA_UID= .env | cut -d '=' -f2-)
INTRA_SECRET=$(grep ^INTRA_SECRET= .env | cut -d '=' -f2-)
NEXT_PUBLIC_INTRA_LINK="https://api.intra.42.fr/oauth/authorize?client_id=$INTRA_UID&redirect_uri=http%3A%2F%2F$IP%3A3030%2F&response_type=code"
SERVER_NEST_ACCESS="http://nest-app:3000"
NEXT_PUBLIC_DEV=$(grep ^DEV= .env | cut -d '=' -f2-)
SERVER_SECRET=$(grep ^SERVER_SECRET= .env | cut -d '=' -f2-)
FILE_LOCATION="src/client-side/app/.env"

echo "NEXT_PUBLIC_BACKEND_API_BASE_URL=$NEXT_PUBLIC_BACKEND_API_BASE_URL" > $FILE_LOCATION
echo "NEXT_PUBLIC_FRONTEND_API_BASE_URL=$NEXT_PUBLIC_FRONTEND_API_BASE_URL" >> $FILE_LOCATION
echo "NEXT_PUBLIC_HOST_NAME=$NEXT_PUBLIC_HOST_NAME" >> $FILE_LOCATION
echo "NEXT_PUBLIC_INTRA_LINK=$NEXT_PUBLIC_INTRA_LINK" >> $FILE_LOCATION
echo "SERVER_NEST_ACCESS=$SERVER_NEST_ACCESS" >> $FILE_LOCATION
echo "NEXT_PUBLIC_DEV=$NEXT_PUBLIC_DEV" >> $FILE_LOCATION
echo "SERVER_SECRET=$SERVER_SECRET" >> $FILE_LOCATION
echo "INTRA_UID=$INTRA_UID" >> $FILE_LOCATION
echo "INTRA_SECRET=$INTRA_SECRET" >> $FILE_LOCATION
echo "Updated .env file with IP address: $IP"

sed -i '' '/^FRONT_END_API/d' .env
echo "FRONT_END_API=http://$IP:3030" >> .env
echo "Updated .env file with IP address: $IP"