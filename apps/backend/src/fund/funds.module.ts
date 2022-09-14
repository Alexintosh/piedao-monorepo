import { CoinGeckoAdapter, TheGraphAdapter } from '@domain/data-sync';
import { Module } from '@nestjs/common';
import { EthersModule, EthersProvider } from '../ethers';
import { FundLoader } from './loaders/FundLoader';
import {
  MongooseConnectionProvider,
  MongoPieSmartPoolRepository,
  MongoPieVaultRepository,
  MongoYieldVaultRepository,
} from './repository';
import { MongoTokenRepository } from './repository/MongoTokenRepository';
import { PieVaultResolver, TokenResolver } from './resolver';

const CoinGeckoAdapterProvider = {
  provide: CoinGeckoAdapter,
  useClass: CoinGeckoAdapter,
};

const TheGraphAdapterProvider = {
  provide: TheGraphAdapter,
  useClass: TheGraphAdapter,
};

@Module({
  imports: [],
  controllers: [],
  providers: [
    MongoTokenRepository,
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
    FundLoader,
    CoinGeckoAdapterProvider,
    TheGraphAdapterProvider,
    MongooseConnectionProvider,
    TokenResolver,
    PieVaultResolver,
  ],
  exports: [
    MongoTokenRepository,
    MongoPieSmartPoolRepository,
    MongoPieVaultRepository,
    MongoYieldVaultRepository,
    FundLoader,
    MongooseConnectionProvider,
    TokenResolver,
    PieVaultResolver,
  ],
})
export class FundsModule {}
