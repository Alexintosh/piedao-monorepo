import { CompoundingFrequency } from '@domain/feature-funds';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import { MongoYieldVaultStrategyRepository } from '../repository';
import { EVERY_DAY } from './constants';

@Injectable()
export class YieldLoader {
  private sentry: ReturnType<SentryService['instance']>;
  constructor(
    private strategyRepository: MongoYieldVaultStrategyRepository,
    @InjectSentry()
    private sentryService: SentryService,
  ) {
    this.sentry = this.sentryService.instance();
  }

  @Interval(EVERY_DAY)
  public updateYields() {
    Logger.log('Updating strategy yields...');
    return pipe(
      TE.fromTask(this.strategyRepository.find()),
      TE.chainW(
        TE.traverseArray((strategy) => {
          const apr = strategy.calculateAPR();
          const compoundingFrequency = CompoundingFrequency.DAILY;
          const apy = strategy.simulateAPY(compoundingFrequency);
          return this.strategyRepository.addYieldData(
            strategy.chain,
            strategy.address,
            {
              apr,
              timestamp: new Date(),
              apy: { compoundingFrequency, value: apy },
            },
          );
        }),
      ),
      TE.bimap(
        (error) => {
          this.sentry.captureException(error);
          Logger.error(error);
          return error;
        },
        (result) => {
          Logger.log('Strategy yields updated successfully.');
          return result;
        },
      ),
    );
  }
}
