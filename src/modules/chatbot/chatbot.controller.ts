// gemini.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GeminiService } from './chatbot.service';
import { ChatbotRequestDto } from './dto/chatbot-request.dto';

@ApiTags('chatbot')
@Controller('chatbot')
export class GeminiController {
  constructor(private readonly gemini: GeminiService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to the chatbot' })
  @ApiResponse({
    status: 200,
    description: 'Chatbot response',
    schema: {
      type: 'object',
      properties: {
        reply: {
          type: 'string',
          example:
            'I can help you with movie information, showtimes, and booking assistance.',
        },
      },
    },
  })
  async sendMessage(@Body() dto: ChatbotRequestDto) {
    const reply = await this.gemini.chat(dto.message, dto.history || []);
    return { reply };
  }
}
