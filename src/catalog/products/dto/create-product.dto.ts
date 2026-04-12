import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SERVICE = 'SERVICE',
}

class ProductDimensionsDto {
  @ApiPropertyOptional({
    description: 'Package length in centimeters.',
    example: 30.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  lengthCm?: number;

  @ApiPropertyOptional({
    description: 'Package width in centimeters.',
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  widthCm?: number;

  @ApiPropertyOptional({
    description: 'Package height in centimeters.',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  heightCm?: number;
}

class CreateProductImageDto {
  @ApiProperty({
    description: 'CDN or object-storage URL for the image.',
    example: 'https://cdn.example.com/products/shirt/front.jpg',
  })
  @IsUrl({ require_protocol: true })
  url!: string;

  @ApiPropertyOptional({
    description: 'Accessible alt text for the image.',
    example: 'Front view of a blue Oxford shirt',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  altText?: string;

  @ApiPropertyOptional({
    description: 'Display order for the image.',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Whether this is the primary storefront image.',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary?: boolean;
}

class CreateProductOptionDto {
  @ApiProperty({
    description: 'Variant option name shown to customers.',
    example: 'Size',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional({
    description: 'Sorting position of the option.',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number;

  @ApiProperty({
    description: 'Allowed values for this option.',
    example: ['S', 'M', 'L'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  values!: string[];
}

class CreateProductVariantDto {
  @ApiProperty({
    description: 'Sellable variant title.',
    example: 'Blue / Medium',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @ApiProperty({
    description: 'Unique stock keeping unit for fulfillment and line items.',
    example: 'OXF-BLU-M',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'SKU must contain only uppercase letters, numbers, hyphens, or underscores',
  })
  sku!: string;

  @ApiPropertyOptional({
    description: 'Barcode such as UPC, EAN, or ISBN.',
    example: '123456789012',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  barcode?: string;

  @ApiProperty({
    description: 'Selling price for this variant.',
    example: 79.99,
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price!: number;

  @ApiPropertyOptional({
    description: 'Reference price shown as a markdown comparison.',
    example: 99.99,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({
    description: 'Internal landed or supplier cost.',
    example: 35.5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Whether inventory should be tracked for this variant.',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  trackInventory?: boolean;

  @ApiPropertyOptional({
    description: 'Whether checkout is allowed when inventory is below zero.',
    example: false,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  allowBackorder?: boolean;

  @ApiPropertyOptional({
    description: 'Current on-hand inventory quantity.',
    example: 120,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  inventoryQuantity?: number;

  @ApiPropertyOptional({
    description: 'Threshold that should trigger low-stock alerts.',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({
    description: 'Package weight in grams.',
    example: 450,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  weightGrams?: number;

  @ApiPropertyOptional({
    description: 'Physical package dimensions.',
    type: ProductDimensionsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDimensionsDto)
  dimensions?: ProductDimensionsDto;

  @ApiPropertyOptional({
    description: 'Sorting position of the variant.',
    example: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number;

  @ApiPropertyOptional({
    description: 'Whether this variant should be the default selected one.',
    example: true,
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this variant is available for sale.',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Map of option names to selected values.',
    example: { Color: 'Blue', Size: 'M' },
  })
  @IsOptional()
  @IsObject()
  optionValues?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Extensible JSON metadata for integrations.',
    example: { warehouseBin: 'A-12-4' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Customer-facing product title.',
    example: 'Premium Oxford Shirt',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  title!: string;

  @ApiProperty({
    description: 'Unique SEO-friendly slug.',
    example: 'premium-oxford-shirt',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase kebab-case',
  })
  slug!: string;

  @ApiPropertyOptional({
    description: 'Short summary for cards or previews.',
    example: 'Wrinkle-resistant Oxford shirt for work and casual wear.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(320)
  shortDescription?: string;

  @ApiPropertyOptional({
    description: 'Rich product description.',
    example:
      'Made from 100% premium cotton with reinforced seams and a tailored fit.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Brand identifier from the catalog brand master.',
    example: '9d6d4f05-a6d8-4af5-b0cc-9f4e91346659',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiProperty({
    description: 'At least one category identifier the product belongs to.',
    example: ['99f8af39-e3bf-4957-8327-2a96ed4268f7'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds!: string[];

  @ApiPropertyOptional({
    description: 'Catalog workflow status.',
    enum: ProductStatus,
    example: ProductStatus.DRAFT,
    default: ProductStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Type of sellable item.',
    enum: ProductType,
    example: ProductType.PHYSICAL,
    default: ProductType.PHYSICAL,
  })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiPropertyOptional({
    description: 'Three-letter ISO currency code.',
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency code must be a valid ISO 4217 uppercase code',
  })
  currencyCode?: string;

  @ApiPropertyOptional({
    description: 'Whether tax should be applied to this product.',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isTaxable?: boolean;

  @ApiPropertyOptional({
    description: 'Whether shipping is required for fulfillment.',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  requiresShipping?: boolean;

  @ApiPropertyOptional({
    description: 'Jurisdiction-specific tax code.',
    example: 'APPAREL_STANDARD',
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxCode?: string;

  @ApiPropertyOptional({
    description: 'ISO 3166-1 alpha-2 country of origin.',
    example: 'BD',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, {
    message: 'Country of origin must be an ISO 3166-1 alpha-2 code',
  })
  countryOfOrigin?: string;

  @ApiPropertyOptional({
    description: 'HS tariff code for customs and shipping.',
    example: '6205.20',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  hsCode?: string;

  @ApiPropertyOptional({
    description: 'SEO title tag.',
    example: 'Premium Oxford Shirt | North Loom',
  })
  @IsOptional()
  @IsString()
  @MaxLength(70)
  seoTitle?: string;

  @ApiPropertyOptional({
    description: 'SEO meta description.',
    example:
      'Shop a premium Oxford shirt with tailored fit and all-day comfort.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  seoDescription?: string;

  @ApiPropertyOptional({
    description: 'Search and merchandising tags.',
    example: ['shirt', 'formal', 'cotton'],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @ArrayMaxSize(25)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Publish timestamp in ISO 8601 format.',
    example: '2026-04-11T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({
    description: 'Custom JSON metadata.',
    example: { collection: 'spring-2026' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'createdBy cannot be assigned from this route. It is populated from the authenticated user.',
  })
  createdBy?: never;

  @ApiHideProperty()
  @IsEmpty({
    message:
      'updatedBy cannot be assigned from this route. It is populated from the authenticated user.',
  })
  updatedBy?: never;

  @ApiPropertyOptional({
    description: 'Product gallery images.',
    type: [CreateProductImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];

  @ApiPropertyOptional({
    description: 'Variant option definitions such as size and color.',
    type: [CreateProductOptionDto],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique((option: CreateProductOptionDto) => option.name)
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionDto)
  options?: CreateProductOptionDto[];

  @ApiProperty({
    description:
      'Sellable variants. Industry-standard catalogs should always sell variants, even if there is only one.',
    type: [CreateProductVariantDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((variant: CreateProductVariantDto) => variant.sku)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants!: CreateProductVariantDto[];
}
