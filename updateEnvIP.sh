IP=$(ifconfig | grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b" | sed -n '2p')
sed -i.bak -e "s#^NEXT_PUBLIC_BACKEND_API_BASE_URL=.*#NEXT_PUBLIC_BACKEND_API_BASE_URL=http://$IP:3000#g" \
            -e "s#^NEXT_PUBLIC_FRONTEND_API_BASE_URL=.*#NEXT_PUBLIC_FRONTEND_API_BASE_URL=http://$IP:3030#g" .env

echo "Updated .env file with IP address: $IP"