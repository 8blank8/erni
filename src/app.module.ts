import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskBot, TelegramBotService } from './telegram.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ChatGPTService } from './open-ai.service';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TelegramBotService,
    TaskBot,
    ChatGPTService
  ],
})
export class AppModule { }
