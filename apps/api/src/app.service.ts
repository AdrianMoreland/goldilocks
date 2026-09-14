import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getStatus() {
    return {
      name: 'Merrion Gold API',
      status: 'ok',
      port: this.configService.get<number>('PORT', 4000),
    };
  }
}
