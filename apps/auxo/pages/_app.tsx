import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { GoogleAnalytics, usePagesViews, event } from 'nextjs-google-analytics';
import { Web3ReactProvider } from '@web3-react/core';
import { init, Web3OnboardProvider } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import getLibrary from '../connectors';
import { Web3ContextProvider } from '../components/MultichainProvider/MultichainProvider';
import { wrapper } from '../store';
import { NotificationDisplay } from '../components/Notifications/Notifications';
import ModalManager from '../components/Modals/ModalManager';
import ModalStakingSuccess from '../components/Modals/ModalSuccess';
import './styles.css';
import './app.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import RewardsModalManager from '../components/Modals/Rewards/RewardsModalManager';
import ClaimSuccess from '../components/Modals/Rewards/ClaimSuccess';

const injected = injectedModule();

const web3Onboard = init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://eth.llamarpc.com',
    },
  ],
  connect: {
    autoConnectAllPreviousWallet: true,
  },
});

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    label: id,
    nonInteraction: true,
  });
}

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function CustomApp({ Component, ...rest }: AppPropsWithLayout) {
  const queryClient = new QueryClient();
  const { props, store } = wrapper.useWrappedStore(rest);
  usePagesViews();
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Web3ContextProvider>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <Head>
                <title>Welcome to AUXO</title>
              </Head>
              <GoogleAnalytics />
              <div className="h-full">
                <NotificationDisplay />
                <ModalManager />
                <ModalStakingSuccess />
                <RewardsModalManager />
                <ClaimSuccess />
                {getLayout(<Component {...props.pageProps} />)}
              </div>
            </Provider>
          </QueryClientProvider>
        </Web3ReactProvider>
      </Web3OnboardProvider>
    </Web3ContextProvider>
  );
}

export default CustomApp;
