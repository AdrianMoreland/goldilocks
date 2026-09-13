import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { MetalsModule } from '../metals/metals.module';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [MetalsModule, ProductsModule],
    controllers: [TradeController],
    providers: [TradeService],
})
export class TradeModule {}
