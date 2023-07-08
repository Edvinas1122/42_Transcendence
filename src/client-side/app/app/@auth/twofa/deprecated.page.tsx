import React, {useState} from 'react';
import { AuthCodeDTO } from '@/lib/DTO/AuthData';
import { ft_fetch } from '@/lib/fetch.util';
import TwoFaUI from './deprecated.twofaUI';

const Page: Function = async () => {

    // const token = await ft_fetch<AuthCodeDTO>("/auth/DevUser2FA/");

    return (
        <TwoFaUI />
    )
};

export default Page;