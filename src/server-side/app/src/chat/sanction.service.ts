import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sanction } from "./entities/sanction.entity";
import { SanctionType } from "./entities/sanction.entity";

@Injectable()
export class SanctionService {
	constructor(
		@InjectRepository(Sanction)
		private sanctionRepository: Repository<Sanction>,
	) {}

	async imposeSanction(
		userId: number,
		chatId: number,
		durration: number,
		type: SanctionType = SanctionType.KICKED,
	): Promise<Sanction> {
		const time = new Date();
		time.setSeconds(time.getSeconds() + durration);
		const sanction = {
			userId,
			sanctionType: type,
			chatId,
			sanctionUntil: time,
		};
		const newSanction = this.sanctionRepository.create(sanction);
		return await this.sanctionRepository.save(newSanction);
	}

	async removeSanction(
		userId: number,
		chatId: number
	): Promise<void> {
		const sanction = await this.findSanction(userId, chatId);
		if (sanction) {
			console.log("removing sanction",sanction);
			this.sanctionRepository.delete(sanction);
		} else {
			throw new BadRequestException('No sanction found.');
		}
	}

	async hasActiveSanction(
		userId: number,
		chatId: number
	): Promise<Sanction | null> {
		const sanction = await this.findSanction(userId, chatId);
		if (sanction) {
			const now = new Date();
			if (sanction.sanctionUntil.getTime() > now.getTime()) {
				return sanction;
			}
			this.sanctionRepository.delete(sanction);
		}
		return null;
	}

	private async findSanction(
		userId: number,
		chatId: number
	): Promise<Sanction | null> {
		return await this.sanctionRepository.findOne({
			where: {
				userId,
				chatId,
			},
		});
	}
}
