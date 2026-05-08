import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';

// The CatalogModule serves as the main module for the catalog domain, aggregating all related submodules like ProductsModule. It can be imported into the AppModule to integrate the catalog functionality into the application.
@Module({
  imports: [ProductsModule],
})
export class CatalogModule {}
