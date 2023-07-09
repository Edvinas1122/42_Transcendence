import { Module } from "@nestjs/common";
import { LiveGameQue } from "./liveQue.service";
import { SocketModule } from "../socket/socket.module";
import { UsersModule } from "../users/users.module";
import { GameService } from "./pongGame.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";
import { Achievement } from "./entities/achievement.entity";
import { AchievementService, ACHIEVEMENT_DEFINITIONS } from "./achievement.service";
import { MatchService } from "./match.service";
import { GameController } from "./game.controller";
import { RankService } from "./rank.service";
import { InviteService } from "./invite.service";
import { EventsModule } from "../events/events.module";

@Module({
	imports: [EventsModule, SocketModule, UsersModule, TypeOrmModule.forFeature([Match, Achievement])],
	controllers: [GameController],
	providers: [LiveGameQue, GameService, AchievementService,
		{
			provide: 'ACHIEVEMENT_DEFINITIONS',
			useValue: ACHIEVEMENT_DEFINITIONS,
		},
		MatchService,
		RankService,
		InviteService
	],
	exports: [LiveGameQue, GameService],
})
export class GameModule {}