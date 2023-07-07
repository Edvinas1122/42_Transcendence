"use client";

export interface TwoFACodeDTO {
    code: string;
}

export interface AuthCodeDTO{
	accessToken: string | undefined;
	id?: string;
}