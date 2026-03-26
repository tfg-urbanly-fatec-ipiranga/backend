import { Test, TestingModule } from '@nestjs/testing';
import { BuscaService } from './busca.service';

describe('BuscaService', () => {
  let service: BuscaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuscaService],
    }).compile();

    service = module.get<BuscaService>(BuscaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
