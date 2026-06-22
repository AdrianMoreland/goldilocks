import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getPort(): string {
    return this.configService.get<string>('PORT') || '3001';
  }
}
