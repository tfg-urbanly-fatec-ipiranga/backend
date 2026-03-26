import { Module } from '@nestjs/common';
import { BuscaController } from './busca.controller';
import { BuscaService } from './busca.service';

@Module({
  controllers: [BuscaController],
  providers: [BuscaService]
})
export class BuscaModule {}
