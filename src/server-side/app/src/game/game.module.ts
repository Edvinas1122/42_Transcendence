import { Module } from "@nestjs/common";
import { LiveGameQue } from "./liveQue.service";
import { SocketModule } from "../socket/socket.module";
import { UsersModule } from "../users/users.module";

@Module({
	imports: [SocketModule, UsersModule],
	controllers: [],
	providers: [LiveGameQue],
	exports: [LiveGameQue],
})
export class GameModule {}