import { CurrencyData, SupportedCurrency } from '@domain/feature-funds';
import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Represents market data denominated in a specific currency.',
})
export class CurrencyDataEntity implements CurrencyData {
  @Field(() => String, { description: 'The name of the currency (eg: ETH)' })
  currency: SupportedCurrency;
  @Field(() => Float)
  price: number;
  @Field(() => Float)
  marketCap: number;
  @Field(() => Float)
  volume: number;
}
