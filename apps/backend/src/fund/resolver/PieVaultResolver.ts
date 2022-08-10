import {
  DEFAULT_CHILD_FILTER,
  DEFAULT_ENTITY_OPTIONS,
  PieVault,
  TokenFilters,
} from '@domain/feature-funds';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { SupportedChain } from '@shared/util-types';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { MongoPieVaultRepository } from '../repository';
import { Options as Options } from './dto';
import { PieVaultEntity } from './entity';

@Resolver(() => PieVaultEntity)
export class PieVaultResolver {
  constructor(private readonly repository: MongoPieVaultRepository) {}

  @Query(() => [PieVaultEntity], {
    name: 'pieVaults',
    description: 'Returns all pie vaults.',
  })
  async findAll(
    @Args('currency', { nullable: false })
    currency: string,
    @Args('options', { nullable: true })
    options?: Options,
  ): Promise<PieVaultEntity[]> {
    const filters: TokenFilters = {
      entity: DEFAULT_ENTITY_OPTIONS,
      marketData: DEFAULT_CHILD_FILTER,
    };
    if (options?.marketData) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      options?.marketData?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.marketData = {
        limit: options.marketData?.limit ?? undefined,
        orderBy,
      };
    }
    if (options?.entity) {
      const orderBy: Record<string, 'asc' | 'desc'> = {};
      options?.entity?.orderBy?.forEach(({ field, value }) => {
        orderBy[field] = value;
      });
      filters.entity = {
        limit: options.entity?.limit ?? undefined,
        orderBy,
      };
    }
    return pipe(
      this.repository.find(filters),
      T.map((vaults) => {
        return vaults.map((vault) => {
          return this.mapVault(vault, currency);
        });
      }),
    )();
  }

  @Query(() => PieVaultEntity, {
    name: 'pieVault',
    description: 'Returns a pie vault by its address.',
  })
  async findOne(
    @Args('currency', { nullable: false })
    currency: string,
    @Args('chain', { nullable: false })
    chain: string,
    @Args('address', { nullable: false })
    address: string,
  ): Promise<PieVaultEntity> {
    const result = await pipe(
      this.repository.findOne({
        chain: chain as SupportedChain,
        address,
      }),
      TE.map((vault) => {
        return this.mapVault(vault, currency);
      }),
    )();

    if (E.isRight(result)) {
      return result.right;
    } else {
      throw result.left;
    }
  }

  private mapVault(vault: PieVault, currency: string): PieVaultEntity {
    return {
      chain: vault.chain,
      address: vault.address,
      name: vault.name,
      symbol: vault.symbol,
      decimals: vault.decimals,
      currency: currency,
      riskGrade: 'AAA',
      inceptionDate: '',
      kind: 'PieVault',
      marketData: vault.marketData.map((marketData) => {
        const currencyData = marketData.currencyData.find(
          (entry) => entry.currency === currency,
        );
        return {
          currentPrice: currencyData?.price ?? 0,
          twentyFourHourChange: {
            price: currencyData?.priceChange24h,
            change: currencyData?.priceChangePercentage24h,
          },
          fromInception: 0,
          deltaToNav: 0,
          interests: {
            apr: 0,
            apy: 0,
          },
          nav: 0,
          marketCap: currencyData?.marketCap ?? 0,
          numberOfHolders: 0,
          allTimeHigh: currencyData?.ath,
          allTimeLow: currencyData?.atl,
          swapFee: null,
          managementFee: null,
          totalSupply: marketData.circulatingSupply,
        };
      }),
      governance: [],
      underlyingTokens: [],
    };
  }
}
