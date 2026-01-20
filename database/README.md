# Database Setup Guide

This guide will help you set up the required database tables in your Supabase project.

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Copy the contents of `database/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the script

## Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db push
```

## What the Schema Creates

### Tables

#### `items` Table

- `id` (UUID) - Primary key, auto-generated
- `name` (VARCHAR) - Item name (required)
- `description` (TEXT) - Item description (optional)
- `created_at` (TIMESTAMP) - Creation timestamp (auto-generated)
- `updated_at` (TIMESTAMP) - Update timestamp (auto-updated)

### Security

- Row Level Security (RLS) is enabled
- Default policy allows all operations (you should customize this for production)

### Triggers

- Automatic `updated_at` timestamp update on record modification

## Customizing Row Level Security

For production, you should replace the default policy with more restrictive ones. Here are some examples:

### Allow authenticated users to read all items

```sql
CREATE POLICY "Allow authenticated read" ON items
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

### Allow authenticated users to insert their own items

```sql
CREATE POLICY "Allow authenticated insert" ON items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id); -- Assumes you add a user_id column
```

### Allow users to update only their own items

```sql
CREATE POLICY "Allow users to update own items" ON items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## Verifying Setup

After running the schema, verify it worked:

1. Go to **Table Editor** in Supabase dashboard
2. You should see the `items` table
3. Check that sample data was inserted (3 items)

## Adding More Tables

To add more tables for your application:

1. Create a new `.sql` file in the `database/` directory
2. Define your table structure
3. Run it through the Supabase SQL Editor or CLI
4. Create corresponding DTOs and services in your NestJS application
