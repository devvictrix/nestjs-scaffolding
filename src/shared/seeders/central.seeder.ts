import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CentralSeeder implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const typeOrmSynchonize =
      this.configService.get<string>('TYPEORM_SYNCHONIZE') === 'TRUE';

    if (typeOrmSynchonize) {
    }
  }
}
