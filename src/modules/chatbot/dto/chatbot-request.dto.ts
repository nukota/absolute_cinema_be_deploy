import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ChatHistoryItemDto {
  @ApiProperty({
    description: 'Role of the message sender',
    example: 'user',
    enum: ['user', 'model'],
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'What movies are showing today?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class ChatbotRequestDto {
  @ApiProperty({
    description: 'User message to the chatbot',
    example: 'What movies are showing today?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'Chat history for context',
    type: [ChatHistoryItemDto],
    example: [
      { role: 'user', content: 'Hello' },
      { role: 'model', content: 'Hi! How can I help you?' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatHistoryItemDto)
  history?: ChatHistoryItemDto[];
}
