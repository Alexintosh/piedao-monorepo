import { useSelectedVault } from "../../../hooks/useSelectedVault";
import DepositWithdrawSwitcher from "../Actions/DepositWithdrawSwitcher";
import { VaultAssetExposureCard, VaultExtendedInformationCard, VaultInfoCard } from "./Cards";
import VaultSummaryUser from "./VaultSummaryUser";
import { VaultPoolAPY, VEDoughStatusRow, FloatingBackground } from "./StatusRows";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Vault } from "../../../store/vault/Vault";
import { useAppDispatch } from "../../../hooks";
import { setSelectedVault } from "../../../store/vault/vault.slice";
import VaultCapSlider from "./VaultCapSlider";

function VaultContentBlocks({ vault }: { vault: Vault | undefined }): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4">
      <VaultAssetExposureCard />
      <VaultExtendedInformationCard />
      <VaultInfoCard vault={vault}/>
    </section>
  )
}

function VaultActionBlocks({ vault }: { vault: Vault | undefined }): JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="min-h-[20rem] bg-white border-gradient rounded-xl shadow-md">
        <DepositWithdrawSwitcher vault={vault}/>
      </div>
      <div className="bg-white rounded-xl shadow-md p-5">
        <VaultSummaryUser vault={vault} loading={false} />
      </div>
    </section>
  )
}

function VaultDetails(): JSX.Element {
  const vault = useSelectedVault();
  const params = useParams();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (!vault && params && params.vaultId) {
      dispatch(setSelectedVault(params.vaultId))
    };
  }, [vault, dispatch, params]);

  return (
    <section className="">
      <VEDoughStatusRow />
      <FloatingBackground />
      <section className="
          grid
          grid-cols-12
          grid-flow-rows
          gap-4
          z-20
          relative
          mx-5
        ">
        <div className="
            col-span-12 lg:col-span-6 xl:col-span-6
            order-2 lg:order-1 text-gray-700
          ">
          <VaultPoolAPY vault={vault} />
          <VaultContentBlocks vault={vault} />
        </div>
        <div className="
          col-span-12 lg:col-span-6 xl:col-span-6
          order-1 lg:order-2 text-gray-700
          ">
          <VaultCapSlider />
          <VaultActionBlocks vault={vault} />
        </div>
      </section>
    </section>
  )
}

export default VaultDetails
