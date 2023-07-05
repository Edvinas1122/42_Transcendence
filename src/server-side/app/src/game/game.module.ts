import { Module } from "@nestjs/common";
import { LiveGameQue } from "./liveQue.service";
import { SocketModule } from "../socket/socket.module";
import { UsersModule } from "../users/users.module";
import { GameService } from "./pongGame.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Match } from "./entities/match.entity";
import { Achievement } from "./entities/achievement.entity";
import { AchievementService } from "./achievement.service";
import { MatchService } from "./match.service";

@Module({
	imports: [SocketModule, UsersModule, TypeOrmModule.forFeature([Match, Achievement])],
	controllers: [],
	providers: [LiveGameQue, GameService, AchievementService, MatchService],
	exports: [LiveGameQue],
})
export class GameModule {}