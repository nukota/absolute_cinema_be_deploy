import { ApiProperty } from '@nestjs/swagger';

export enum MovieStatus {
  UPCOMING = 'upcoming',     // Chưa chiếu
  NOW_SHOWING = 'now_showing', // Đang chiếu
  ENDED = 'ended',           // Đã chiếu xong
}

export class MovieResponseDto {
  @ApiProperty({ example: '6d8f08c9-9db1-4e5f-bf31-8b942b8ad14e' })
  movie_id: string;

  @ApiProperty({ example: 'Avengers: Endgame' })
  title: string;

  @ApiProperty({ example: 'avengers-endgame' })
  slug: string;

  @ApiProperty({ example: 'A mind-bending thriller directed by Christopher Nolan', required: false })
  description?: string;

  @ApiProperty({ example: 148 })
  duration_min: number;

  @ApiProperty({ example: '2010-07-16' })
  release_date: string;

  @ApiProperty({ example: 'PG-13', required: false })
  rating?: string;

  @ApiProperty({ example: 'https://example.com/poster/inception.jpg', required: false })
  poster_url?: string;

  @ApiProperty({ example: 'https://example.com/trailer/inception.mp4', required: false })
  trailer_url?: string;

  @ApiProperty({ example: 'Christopher Nolan', required: false })
  director?: string;

  @ApiProperty({
    example: [
      { name: 'Leonardo DiCaprio', role: 'Cobb' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
    ],
    required: false,
  })
  actors?: any;

  @ApiProperty({
    example: ['Action', 'Sci-Fi', 'Thriller'],
    required: false,
  })
  genre?: any;

  @ApiProperty({ example: '2024-11-04T09:00:00.000Z', required: false })
  created_at?: string;

  @ApiProperty({
    enum: MovieStatus,
    example: MovieStatus.NOW_SHOWING,
    description: 'Status of the movie based on release date',
  })
  status: MovieStatus;

  constructor(partial: Partial<MovieResponseDto>) {
    Object.assign(this, partial);
    this.status = this.calculateStatus();
  }

  private calculateStatus(): MovieStatus {
    if (!this.release_date) return MovieStatus.UPCOMING;

    const releaseDate = new Date(this.release_date);
    const today = new Date();

    const diffDays = (today.getTime() - releaseDate.getTime()) / (1000 * 3600 * 24);

    if (diffDays < 0) return MovieStatus.UPCOMING;
    if (diffDays <= 90) return MovieStatus.NOW_SHOWING; // giả định phim chiếu trong 3 tháng
    return MovieStatus.ENDED;
  }
}
