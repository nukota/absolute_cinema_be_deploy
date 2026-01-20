import { ApiProperty } from '@nestjs/swagger';

export class DashboardStats {
  @ApiProperty({
    description: 'Total revenue for the selected month',
    example: 50000000,
  })
  total_revenue: number;

  @ApiProperty({
    description: 'Total number of customers (all time)',
    example: 150,
  })
  total_customers: number;

  @ApiProperty({
    description: 'Number of movies showing in the next 30 days',
    example: 12,
  })
  movies_showing: number;

  @ApiProperty({
    description: 'Total tickets sold for the selected month',
    example: 450,
  })
  tickets_sold: number;
}

export class DailyData {
  @ApiProperty({
    description: 'Date in YYYY-MM-DD format',
    example: '2025-11-01',
  })
  date: string;

  @ApiProperty({
    description: 'Revenue for that day',
    example: 3500000,
  })
  revenue: number;

  @ApiProperty({
    description: 'Number of tickets sold that day',
    example: 45,
  })
  tickets: number;
}

export class GenreDistribution {
  @ApiProperty({
    description: 'Genre name',
    example: 'Action',
  })
  genre: string;

  @ApiProperty({
    description: 'Percentage of tickets sold for this genre',
    example: 35,
  })
  percentage: number;
}

export class TopMovie {
  @ApiProperty({
    description: 'Movie title',
    example: 'Avengers: Endgame',
  })
  movie_name: string;

  @ApiProperty({
    description: 'Number of tickets sold',
    example: 120,
  })
  tickets_sold: number;
}

export class DashboardData {
  @ApiProperty({
    type: DashboardStats,
    description: 'Overall statistics',
  })
  stats: DashboardStats;

  @ApiProperty({
    type: [DailyData],
    description: 'Daily data for the selected month (one entry per 2 days)',
  })
  daily_data: DailyData[];

  @ApiProperty({
    type: [GenreDistribution],
    description: 'Genre distribution based on ticket sales',
  })
  genre_distribution: GenreDistribution[];

  @ApiProperty({
    type: [TopMovie],
    description: 'Top 10 movies by ticket sales',
  })
  top_movies: TopMovie[];

  @ApiProperty({
    description: 'Selected month in YYYY-MM format',
    example: '2025-11',
  })
  month: string;
}
