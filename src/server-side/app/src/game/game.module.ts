import { Module } from "@nestjs/common";
import { LiveGameQue } from "./liveQue.service";
import { SocketModule } from "../socket/socket.module";
import { UsersModule } from "../users/users.module";
import { GameService } from "./pongGame.service";

@Module({
	imports: [SocketModule, UsersModule],
	controllers: [],
	providers: [LiveGameQue, GameService],
	exports: [LiveGameQue],
})
export class GameModule {}