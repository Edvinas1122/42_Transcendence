import fetchWithToken from '@/app/network/fetchWithToken';

const sendFriendRequest = async (receiverId) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: receiverId })
    };

    return fetchWithToken(`/users/manage/send-friend-request/${receiverId}`, requestOptions)
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
};

export default sendFriendRequest;