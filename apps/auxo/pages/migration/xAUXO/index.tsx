import { ReactElement, useEffect } from 'react';
import { Layout } from '../../../components';
import { wrapper } from '../../../store';
import { useAppDispatch } from '../../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../../store/migration/migration.thunks';
import { useWeb3React } from '@web3-react/core';
import MigrationBackground from '../../../components/MigrationBackground/MigrationBackground';
import useMigrationSteps from '../../../hooks/migrationSteps';

export default function Migration({ token }: { token: 'xAUXO' | 'veAUXO' }) {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const getStep = useMigrationSteps(token);

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      {getStep}
    </div>
  );
}

Migration.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    props: {
      title: 'migration',
      token: 'xAUXO',
    },
  };
});
