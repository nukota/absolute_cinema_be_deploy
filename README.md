# NestJS Supabase Quick Start Template

A production-ready NestJS template with Supabase integration, featuring modular architecture, Swagger API documentation, and JWT authentication.

## Features

- 🚀 NestJS framework with TypeScript
- 🗄️ Supabase integration for database operations
- 📚 Swagger/OpenAPI documentation
- 🔐 Email authentication with Supabase Auth (Sign up, Sign in, Password reset)
- 🛡️ Protected routes with JWT guards
- ✅ Class validation with class-validator
- 🎯 Modular architecture (Controller, Service, Module pattern)
- 🔧 Environment configuration
- 📝 Example CRUD operations with authentication

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `JWT_SECRET`: A secure random string for JWT signing

### 3. Set Up Supabase Database

Create a sample table in your Supabase database:

```sql
-- Example: Items table
CREATE TABLE items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust based on your needs)
CREATE POLICY "Allow all operations" ON items
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 4. Run the Application

Development mode:

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

### 5. Access API Documentation

Once the application is running, visit:

- Swagger UI: `http://localhost:3000/api`

## Project Structure

```
src/
├── config/                 # Configuration files
│   └── supabase.config.ts # Supabase client configuration
├── auth/                  # Authentication module
│   ├── dto/              # Auth DTOs (SignUp, SignIn, etc.)
│   ├── guards/           # Auth guard for protected routes
│   ├── decorators/       # Current user decorator
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── items/                 # Example feature module
│   ├── dto/              # Data Transfer Objects
│   ├── items.controller.ts
│   ├── items.service.ts
│   └── items.module.ts
├── common/                # Shared utilities
│   ├── interfaces/
│   ├── filters/          # Exception filters
│   └── utils/            # Helper functions
├── app.module.ts          # Root module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
└── main.ts               # Application entry point
```

## Usage Examples

### Creating a New Feature Module

1. Generate a new module:

```bash
nest generate module features/your-feature
nest generate controller features/your-feature
nest generate service features/your-feature
```

2. Create DTOs in `features/your-feature/dto/`
3. Implement service methods using Supabase client
4. Add Swagger decorators to controller endpoints

### Using Supabase in Services

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class YourService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async findAll() {
    const { data, error } = await this.supabase.from('your_table').select('*');

    if (error) throw error;
    return data;
  }
}
```

## API Endpoints

### Health Check

- `GET /` - Returns welcome message
- `GET /health` - Health check endpoint

### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Sign in with email/password
- `POST /auth/signout` - Sign out current user
- `GET /auth/me` - Get current user information
- `POST /auth/refresh` - Refresh access token
- `POST /auth/forgot-password` - Send password reset email
- `POST /auth/reset-password` - Reset password with token

### Items (Example Resource)

- `POST /items` - Create a new item (🔒 Protected)
- `GET /items` - Get all items
- `GET /items/:id` - Get item by ID
- `PATCH /items/:id` - Update an item (🔒 Protected)
- `DELETE /items/:id` - Delete an item (🔒 Protected)

🔒 = Requires authentication

For detailed authentication documentation, see [AUTHENTICATION.md](AUTHENTICATION.md)

## Environment Variables

| Variable                  | Description                          | Required           |
| ------------------------- | ------------------------------------ | ------------------ |
| PORT                      | Server port                          | No (default: 3000) |
| NODE_ENV                  | Environment (development/production) | Yes                |
| SUPABASE_URL              | Supabase project URL                 | Yes                |
| SUPABASE_ANON_KEY         | Supabase anonymous key               | Yes                |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key            | Yes                |
| JWT_SECRET                | Secret for JWT signing               | Yes                |
| JWT_EXPIRES_IN            | JWT expiration time                  | No (default: 7d)   |
| FRONTEND_URL              | Frontend URL for password resets     | Yes                |
| CORS_ORIGIN               | Allowed CORS origin                  | No (default: \*)   |

## Building for Production

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

## Authentication

This template includes complete email authentication using Supabase Auth:

- User registration with email/password
- Email verification
- Sign in/Sign out
- Password reset flow
- JWT token management
- Protected routes with guards

See [AUTHENTICATION.md](AUTHENTICATION.md) for detailed documentation.

## Customization Tips

1. **Protect Your Routes**: Add `@UseGuards(AuthGuard)` to any endpoint that requires authentication
2. **Add More Modules**: Use NestJS CLI to generate new modules for your features
3. **Configure CORS**: Update CORS settings in `main.ts` based on your frontend URL
4. **Add Validation**: Use class-validator decorators in DTOs for request validation
5. **Error Handling**: Custom exception filters are included in `common/filters/`
6. **Customize User Data**: Add custom fields to user metadata during sign up

## License

MIT

## Support

For issues and questions:

- NestJS Documentation: https://docs.nestjs.com
- Supabase Documentation: https://supabase.com/docs
