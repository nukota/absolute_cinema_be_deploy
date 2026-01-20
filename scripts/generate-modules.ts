import * as fs from 'fs';
import * as path from 'path';

const SCHEMA_FILE = path.join(__dirname, '../schema.sql');
const OUTPUT_DIR = path.join(__dirname, '../src/modules');

const sql = fs.readFileSync(SCHEMA_FILE, 'utf-8');

// --- Extract all table definitions ---
const tableRegex = /CREATE TABLE IF NOT EXISTS\s+"public"\."(\w+)"\s*\(([\s\S]*?)\);/g;

const tables: Record<string, { name: string; columns: string[] }> = {};

let match;
while ((match = tableRegex.exec(sql)) !== null) {
  const [, tableName, columnsDef] = match;
  const columns = columnsDef
    .split(',')
    .map(c => c.trim())
    .filter(c => c && !c.startsWith('CONSTRAINT'))
    .map(c => c.split(' ')[0].replace(/"/g, ''));

  tables[tableName] = { name: tableName, columns };
}

console.log(`Found ${Object.keys(tables).length} tables:`, Object.keys(tables));

function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// --- Generate files for each table ---
for (const [tableName, { columns }] of Object.entries(tables)) {
  const className = capitalize(tableName);
  const moduleDir = path.join(OUTPUT_DIR, tableName);
  const dtoDir = path.join(moduleDir, 'dto');
  const entityDir = path.join(moduleDir, 'entities');

  fs.mkdirSync(dtoDir, { recursive: true });
  fs.mkdirSync(entityDir, { recursive: true });

  // --- DTOs ---
  const createDto = `import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class Create${className}Dto {
${columns
      .map(c => `  @ApiProperty()\n  @IsString()\n  ${c}: string;`)
      .join('\n\n')}
}
`;

  const updateDto = `import { PartialType } from '@nestjs/swagger';
import { Create${className}Dto } from './create-${tableName}.dto';

export class Update${className}Dto extends PartialType(Create${className}Dto) {}
`;

  const responseDto = `import { ApiProperty } from '@nestjs/swagger';

export class ${className}ResponseDto {
${columns.map(c => `  @ApiProperty()\n  ${c}: string;`).join('\n\n')}
}
`;

  fs.writeFileSync(path.join(dtoDir, `create-${tableName}.dto.ts`), createDto);
  fs.writeFileSync(path.join(dtoDir, `update-${tableName}.dto.ts`), updateDto);
  fs.writeFileSync(path.join(dtoDir, `${tableName}-response.dto.ts`), responseDto);

  // --- Entity ---
  const entity = `import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('${tableName}')
export class ${className} {
${columns
      .map(c =>
        c.endsWith('_id')
          ? `  @PrimaryGeneratedColumn('uuid')\n  ${c}: string;`
          : `  @Column()\n  ${c}: string;`
      )
      .join('\n\n')}
}
`;
  fs.writeFileSync(path.join(entityDir, `${tableName}.entity.ts`), entity);

  // --- Service ---
  const service = `import { Injectable } from '@nestjs/common';
import { Create${className}Dto } from './dto/create-${tableName}.dto';
import { Update${className}Dto } from './dto/update-${tableName}.dto';

@Injectable()
export class ${className}Service {
  create(dto: Create${className}Dto) {
    return 'Create ${tableName}';
  }

  findAll() {
    return 'Find all ${tableName}';
  }

  findOne(id: string) {
    return 'Find one ${tableName}';
  }

  update(id: string, dto: Update${className}Dto) {
    return 'Update ${tableName}';
  }

  remove(id: string) {
    return 'Remove ${tableName}';
  }
}
`;
  fs.writeFileSync(path.join(moduleDir, `${tableName}.service.ts`), service);

  // --- Controller ---
  const controller = `import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ${className}Service } from './${tableName}.service';
import { Create${className}Dto } from './dto/create-${tableName}.dto';
import { Update${className}Dto } from './dto/update-${tableName}.dto';

@Controller('${tableName}')
export class ${className}Controller {
  constructor(private readonly service: ${className}Service) {}

  @Post()
  create(@Body() dto: Create${className}Dto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Update${className}Dto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
`;
  fs.writeFileSync(path.join(moduleDir, `${tableName}.controller.ts`), controller);

  // --- Module ---
  const module = `import { Module } from '@nestjs/common';
import { ${className}Service } from './${tableName}.service';
import { ${className}Controller } from './${tableName}.controller';

@Module({
  controllers: [${className}Controller],
  providers: [${className}Service],
})
export class ${className}Module {}
`;
  fs.writeFileSync(path.join(moduleDir, `${tableName}.module.ts`), module);
}

console.log('All modules generated successfully!');
