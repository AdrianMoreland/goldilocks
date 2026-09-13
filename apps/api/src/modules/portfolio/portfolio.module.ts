import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { ProductsModule } from '../products/products.module';
import { MetalsModule } from '../metals/metals.module';

@Module({
    imports: [ProductsModule, MetalsModule],
    controllers: [PortfolioController],
    providers: [PortfolioService],
})
export class PortfolioModule {}
