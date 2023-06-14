import fetchWithToken from '@/app/network/fetchWithToken';

const blockUser = async (blockeeId) => {
    const blockOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockeeId: blockeeId })
    };

    return fetchWithToken(`users/manage/block-user/${blockeeId}`, blockOptions)
        .then(data => console.log(data))
        .catch(error => console.error('Error: ', error));
};

export default blockUser;