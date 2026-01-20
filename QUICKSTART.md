# Quick Start Guide

Get your NestJS Supabase template up and running in minutes!

## Prerequisites Check

Before you begin, ensure you have:

- [ ] Node.js installed (v18+)
- [ ] npm or yarn package manager
- [ ] A Supabase account and project created
- [ ] Your Supabase credentials ready

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secure-random-string
```

**Where to find Supabase credentials:**

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon)
3. Navigate to **API** section
4. Copy the `URL` and `anon` key
5. Copy the `service_role` key (keep this secret!)

### 3. Set Up Database

Run the database schema:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy contents from `database/schema.sql`
4. Paste and run it

See `database/README.md` for detailed instructions.

### 4. Start Development Server

```bash
npm run start:dev
```

You should see:

```
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation: http://localhost:3000/api
```

### 5. Test the API

Open your browser and visit:

- **API Documentation:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

#### Test Authentication Flow:

```bash
# 1. Sign up a new user
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "full_name":"Test User"
  }'

# 2. Sign in (save the access_token from response)
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'

# 3. Get current user info
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Test Protected Endpoints:

```bash
# Create an item (requires authentication)
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"My First Item","description":"Test item"}'

# Get all items (public)
curl http://localhost:3000/items

# Get single item (public)
curl http://localhost:3000/items/{id}

# Update an item (requires authentication)
curl -X PATCH http://localhost:3000/items/{id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Updated Item"}'

# Delete an item (requires authentication)
curl -X DELETE http://localhost:3000/items/{id} \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

For more API examples, see [API_REFERENCE.md](API_REFERENCE.md)

## What's Next?

### Create Your First Custom Module

Generate a new feature module:

```bash
# Generate module, controller, and service
npx nest generate module features/products
npx nest generate controller features/products
npx nest generate service features/products
```

### Project Structure Overview

```
src/
├── config/          # Configuration files (Supabase setup)
├── common/          # Shared utilities and interfaces
├── items/           # Example feature module
│   ├── dto/        # Data transfer objects
│   ├── items.controller.ts
│   ├── items.service.ts
│   └── items.module.ts
├── app.module.ts    # Root module
└── main.ts         # Application entry point
```

### Common Tasks

**Add validation to DTOs:**

```typescript
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
```

**Use Supabase in a service:**

```typescript
async findAll() {
  const { data, error } = await this.supabase
    .from('your_table')
    .select('*');

  if (error) throw new InternalServerErrorException(error.message);
  return data;
}
```

**Add Swagger documentation:**

```typescript
@ApiOperation({ summary: 'Create a product' })
@ApiResponse({ status: 201, description: 'Product created' })
@Post()
create(@Body() dto: CreateProductDto) {
  return this.service.create(dto);
}
```

## Troubleshooting

**Issue:** Module not found errors

- **Solution:** Run `npm install` to install all dependencies

**Issue:** Supabase connection fails

- **Solution:** Double-check your `.env` file has correct credentials

**Issue:** CORS errors from frontend

- **Solution:** Update `CORS_ORIGIN` in `.env` or modify `main.ts`

**Issue:** Database table doesn't exist

- **Solution:** Make sure you ran the `database/schema.sql` in Supabase

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Swagger/OpenAPI Guide](https://docs.nestjs.com/openapi/introduction)

## Documentation Files

- `README.md` - Main documentation and overview
- `AUTHENTICATION.md` - Detailed authentication guide
- `API_REFERENCE.md` - Quick API endpoint reference
- `DEPLOYMENT.md` - Deployment instructions
- `database/README.md` - Database setup guide

## Need Help?

Check out the documentation files above for detailed information on each topic.
