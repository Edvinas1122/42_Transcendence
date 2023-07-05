import React, {useState} from 'react';
import { AuthCodeDTO } from '@/lib/DTO/AuthData';
import { ft_fetch } from '@/lib/fetch.util';
import TwoFAUI from './twofaUI';

const Page: Function = async () => {

    const token = await ft_fetch<AuthCodeDTO>("/auth/DevUser2FA/");

    return (
        <TwoFAUI token={token} />
    )
};

export default Page;