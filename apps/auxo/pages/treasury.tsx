import useTranslation from 'next-translate/useTranslation';
import { ReactElement } from 'react';
import Image from 'next/image';
import { Layout } from '../components';
import AuxoIcon from '../public/tokens/AUXO.svg';
import {
  formatAsPercent,
  formatBalance,
  formatBalanceCurrency,
} from '../utils/formatBalance';
import { useAppSelector, useStrapiCollection } from '../hooks';
import Tooltip from '../components/Tooltip/Tooltip';
import { TreasuryTabs } from '../components/TreasuryTable';
import {
  BaseSubDarkTextSkeleton,
  BoldSubDarkTextSkeleton,
  BoxLoading,
} from '../components/Skeleton';
import PositionsTabs from '../components/Positions';
import { useWeb3React } from '@web3-react/core';
import { TypesMap } from '../types/cmsTypes';
import AddToWallet from '../components/AddToWallet/AddToWallet';

export default function Treasury(): ReactElement {
  const { defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );

  // const { data, isLoading, isError } = useGetTreasuryQuery({
  //   currency: defaultCurrency,
  // });

  const { t } = useTranslation();
  const { chainId } = useWeb3React();

  const { data: latestReport, isLoading: isReportLoading } =
    useStrapiCollection<TypesMap['reports']>('reports', {
      'sort[0]': 'createdAt:desc',
      'pagination[page]': 1,
      'pagination[pageSize]': 1,
      populate: 'report_file',
    });

  return (
    <>
      <div className="flex flex-col">
        <section className="flex flex-col xl:flex-row w-full gap-4 flex-wrap ">
          <div className="flex flex-wrap sm:flex-nowrap flex-1 items-center gap-2 sm:bg-gradient-primary sm:rounded-full sm:shadow-md self-center w-full xl:w-auto p-2 sm:px-3 sm:py-2">
            <Image src={AuxoIcon} alt={'Auxo Icon'} width={32} height={32} />
            <h2
              className="text-lg font-medium text-primary w-fit"
              data-cy="product-name"
            >
              AUXO
            </h2>
            <AddToWallet token="AUXO" />
          </div>
        </section>

        {/* Section for TVL, Capital Utilization, and APY */}
        <section className="flex flex-wrap justify-between gap-4  text-sm md:text-inherit mt-6">
          <div className="flex gap-x-4 items-center w-full sm:w-fit">
            <div className="flex flex-col py-1">
              {isReportLoading ? (
                <>
                  <BoldSubDarkTextSkeleton />
                  <BaseSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-semibold text-primary sm:text-xl">
                    {formatBalanceCurrency(
                      latestReport?.data?.[0]?.attributes?.tvl,
                      defaultLocale,
                      defaultCurrency,
                    )}
                  </p>

                  <div className="flex text-base text-sub-dark font-medium gap-x-1">
                    {t('tvl')}
                    <Tooltip>{t('tvlTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col py-1">
              {isReportLoading ? (
                <>
                  <BoldSubDarkTextSkeleton />
                  <BaseSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-semibold text-primary sm:text-xl">
                    {formatBalance(
                      latestReport?.data?.[0]?.attributes?.tvl_in_eth,
                      defaultLocale,
                      2,
                      'standard',
                    )}
                  </p>
                  <div className="flex text-base text-sub-dark font-medium gap-x-1">
                    {t('tvlInEth')}
                    <Tooltip>{t('tvlInEthTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col py-1">
              {isReportLoading ? (
                <>
                  <BoldSubDarkTextSkeleton />
                  <BaseSubDarkTextSkeleton />
                </>
              ) : (
                <>
                  <p className="font-semibold text-primary sm:text-xl">
                    {formatAsPercent(
                      latestReport?.data?.[0]?.attributes?.capital_utilisation,
                      defaultLocale,
                    )}
                  </p>
                  <div className="flex text-base text-sub-dark font-medium gap-x-1">
                    {t('capitalUtilization')}
                    <Tooltip>{t('capitalUtilizationTooltip')}</Tooltip>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="grid gap-x-2 items-center w-full sm:w-fit">
            <div className="flex flex-col p-[3px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full sm:w-40">
              <div className="bg-gradient-to-r from-white via-white to-background p-1 rounded-md">
                {isReportLoading ? (
                  <BoxLoading />
                ) : (
                  <>
                    <p className="font-semibold text-primary text-xl">
                      {formatAsPercent(
                        latestReport?.data?.[0]?.attributes?.avg_apr,
                        defaultLocale,
                      )}
                    </p>
                    <div className="flex text-base text-sub-dark font-medium gap-x-1">
                      {t('averageAPR')}
                      <Tooltip>{t('averageAPRTooltip')}</Tooltip>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <TreasuryTabs
          downloadUrl={
            latestReport?.data?.[0]?.attributes?.report_file?.data?.attributes
              ?.url
          }
        />
        <PositionsTabs />
      </div>
    </>
  );
}

Treasury.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
