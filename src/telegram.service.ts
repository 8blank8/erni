import { config } from 'dotenv'
config()
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import TelegramBot from 'node-telegram-bot-api'
import { ChatGPTService } from './open-ai.service';

export class TelegramMessageDto {
    message_id: number
    from: {
        id: number
        is_bot: boolean
        first_name: string
        username: string
        language_code: string
    }
    chat: {
        id: number
        title: string
        type: string
    }
    date: number
    text: string
}

@Injectable()
export class TelegramBotService {
    private readonly bot;

    constructor(
        private gptService: ChatGPTService
    ) {
        this.bot = new TelegramBot(process.env.TOKEN, { polling: true });

        this.bot.on('message', async (msg: TelegramMessageDto) => {
            const chatId = msg.chat.id;
            console.log(chatId)

            if (msg.from.username === 'I_V_I0_0I_V_I') {
                const response = await gptService.generateResponse(msg.text)
                console.log(response)
                this.bot.sendMessage(chatId, 'Привет Вова')
            }

            if (msg.text && msg.text.includes('/hello')) {
                this.bot.sendMessage(chatId, 'Привет! Как дела?');
            }
            if (msg.text && msg.text.includes('эрни')) {
                this.bot.sendMessage(chatId, `${chatId}`)
            }
        });
    }

    sendMessage(chatId: number, message: string) {
        this.bot.sendMessage(chatId, message);
    }
}

@Injectable()
export class TaskBot {
    private readonly bot;

    constructor(
        private telegramService: TelegramBotService
    ) { }

    @Cron(CronExpression.EVERY_5_MINUTES)
    handleBirth() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const nextBirthday = new Date(currentYear, 3, 29);

        if (currentDate.getTime() > nextBirthday.getTime()) {
            nextBirthday.setFullYear(currentYear + 1);
        }

        const timeUntilBirthday = nextBirthday.getTime() - currentDate.getTime();

        const daysUntilBirthday = Math.ceil(timeUntilBirthday / (1000 * 3600));

        this.telegramService.sendMessage(-1002062879534, `До 29 годиков осталось ${daysUntilBirthday} часов!`);
    }
}
