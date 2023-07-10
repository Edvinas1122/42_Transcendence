import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface TokenData {
  link: string;
  expiresAt: number;
}

@Injectable()
export class TmpTokenStore {
	private tokenStore = new Map<string, TokenData>();

	constructor() {
		this.startCleanupTask();
	}
	
	private startCleanupTask() {
		setInterval(() => {
			this.cleanupExpiredKeys();
		}, 60000); // Cleanup task runs every minute (adjust as needed)
	}

	private cleanupExpiredKeys() {
		const currentTime = Date.now();
		for (const [tokenId, tokenData] of this.tokenStore) {
		  if (currentTime >= tokenData.expiresAt) {
			this.tokenStore.delete(tokenId);
			// this.logger.debug(`Token ${tokenId} expired and removed from tokenStore.`);
			}
		}
	}

	storeTokenLink(link: string, expirationSeconds: number, secret: string): string {
		const tokenId = uuidv4();
		const expiresAt = Date.now() + expirationSeconds * 1000;

		const tokenData: TokenData = {
			link,
			expiresAt,
		};

		this.tokenStore.set(tokenId + "-" + secret, tokenData);
		return tokenId;
	}

	retrieveTokenLink(tokenId: string): string | null {
		const tokenData = this.tokenStore.get(tokenId);

		if (tokenData && Date.now() < tokenData.expiresAt) {
			return tokenData.link;
		} else {
			if (tokenData) {
				this.tokenStore.delete(tokenId);
				throw new UnauthorizedException('Token expired');
			}
			return null;
		}
	}
}