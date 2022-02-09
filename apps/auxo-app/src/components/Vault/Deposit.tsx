import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useMonoVaultContract, useTokenContract } from "../../hooks/useContract";
import { Balance, Vault } from "../../store/vault/Vault";
import { prettyNumber } from "../../utils";
import { MissingDecimalsError, TXRejectedError } from "../../errors";
import { Erc20 } from "../../types/artifacts/abi";
import { useState } from "react";
import { useAppDispatch } from "../../hooks";
import { setApproval } from "../../store/vault/vault.slice";
import StyledButton from "../UI/button";
import CardItem from "../UI/cardItem";
import { useSelectedVault } from "../../hooks/useSelectedVault";
import LoadingSpinner from "../UI/loadingSpinner";
import { checkForEvent } from "../../utils/event";
import { zeroBalance } from "../../utils/balances";
import { useWeb3Cache } from "../../hooks/useCachedWeb3";
import MerkleVerify, { useDepositor } from "./MerkleAuthCheck";
import { setAlert } from "../../store/app/app.slice";
import { useEffect } from "react";
import { useRef } from "react";

const conditionallyApprove = async ({
  allowance,
  deposit,
  token,
  spender,
  dispatch
}: {
  allowance: BigNumber,
  deposit: Balance,
  token: Erc20,
  spender: string,
  dispatch: ReturnType<typeof useAppDispatch>,
}): Promise<boolean> => {

  const depositValue = BigNumber.from(deposit.value);

  if (allowance.lt(depositValue)) {
    // allowance needs to increase
    const tx = await token.approve(spender, depositValue);
    const confirm = await checkForEvent(tx, 'Approval');

    if (confirm) {
      dispatch(setApproval(deposit))
      dispatch(setAlert({
        message: 'Approval Successful, waiting for the network',
        show: true,
        type: 'PENDING'
      }))
      return true
    } else { 
      throw new TXRejectedError();
    }

  } else {
    // current allowance is sufficient, no need to increase
    return true
  }
}

function DepositButton ({
  sufficientBalance,
  deposit,
  setDeposit,
  vault  
}: {
  sufficientBalance: boolean,
  deposit: Balance,
  setDeposit: (d: Balance) => void,
  vault: Vault,
}) {
  const dispatch = useAppDispatch()
  const { chainId } = useWeb3Cache()
  const { account } = useWeb3React();
  const monoContract = useMonoVaultContract(vault.address);
  const tokenContract = useTokenContract(vault.token.address);
  const [depositing, setDepositing] = useState(false);
  const allowance = vault.userBalances?.allowance;
  const firstLoad = useRef(true);
  
  useEffect(() => {
    if (!firstLoad.current) {
      dispatch(setAlert({
        show: true,
        message: 'Deposit Complete',
        type: 'SUCCESS'
      }))  
    } else {
      firstLoad.current = false;
    }
  }, [vault.userBalances?.vaultUnderlying.value, dispatch])

  const buttonDisabled = () => {
    const invalidDepost = deposit.label <= 0;
    const insufficientBalance = !sufficientBalance;
    const wrongNetwork =  chainId !== vault.network.chainId
    return insufficientBalance || wrongNetwork || invalidDepost || depositing; 
  }

  const onClick = async () => {
    setDepositing(true)
    try {
      if (tokenContract && account && allowance) {
        await conditionallyApprove({
          deposit,
          dispatch,
          spender: vault.address,
          token: tokenContract,
          allowance: BigNumber.from(allowance.value),
        });
        const tx = await monoContract?.deposit(account, deposit.value)
        const confirm = tx && await checkForEvent(tx, 'Deposit');
        if (confirm) {
          dispatch(setAlert({
            show: true,
            message: 'Transaction approved...',
            type: 'PENDING'
          }));
          setDeposit(zeroBalance());
        } else { 
          dispatch(setAlert({
            message: 'There was a problem with the transaction',
            show: true,
            type: 'ERROR'
          }));
        }
      } else {
        throw new TXRejectedError('Missing Params');
      }
    } catch (err) {
      console.debug(err)
    } finally {
      setDepositing(false)
    }
  }

  return (
    <>
    <div className="ml-2">
      {
        account &&
        <StyledButton
          disabled={buttonDisabled()}
          onClick={() => onClick()}
          >{ depositing ? <LoadingSpinner /> : 'DEPOSIT' }
        </StyledButton>
      }
    </div>
  </>
  )
}

export function DepositInput({ vault }: { vault: Vault }) {
  const decimals = vault.token?.decimals;
  const [deposit, setDeposit] = useState<Balance>({ label: 0, value: '0' });
  const vaultBalance = vault.userBalances?.wallet;
  const [sufficientBalance, setSufficientBalance] = useState(true);
  
  const handleMaxDeposit = () => {   
    setSufficientBalance(true);
    setDeposit({
      label: vaultBalance?.label ?? 0,
      value: vaultBalance?.value ?? '0'
    })
  }
  const handleDepositChange = (value: string) => {
    if (decimals) {
      const num = (value === '' || !value || value === ' ') ? '0' : value; 
      const bigValue = BigNumber.from(num ?? '0').mul(BigNumber.from(10).pow(decimals));
      const d = {
        label: Number(num),
        value: bigValue.toString()
      }
      const suff = bigValue.lte(BigNumber.from(vaultBalance?.value ?? 0));
      setSufficientBalance(suff);
      setDeposit(d)  
    } else {
      throw new MissingDecimalsError()
    }
  }  
  return (
    <section className="h-full">
      <div className="flex flex-col justify-evenly h-full w-full">
        <p>Your {vault.symbol} Balance: <span className="font-bold text-purple-700">{prettyNumber(vaultBalance?.label)}</span></p>
        <div className="flex border-gray-200 rounded-lg border-2 px-5 py-1 mx-5">
          <input
            type="number"
            min="0"
            max={vaultBalance?.label}
            className="focus:outline-none w-full"
            value={deposit.label.toString()}
            onChange={(e) => handleDepositChange(e.target.value)}
          />
          <button
            className="text-blue-300 ml-3"
            onClick={() => handleMaxDeposit()}
            >MAX</button>
        </div>
        <DepositButton
          sufficientBalance={sufficientBalance}
          deposit={deposit}
          setDeposit={setDeposit}
          vault={vault}
          />
      </div>
      {  sufficientBalance ? '' : <p className="text-red-800">Insufficient Balance</p> }
    </section>
  )
}

function DepositCard({ loading }: { loading: boolean }) {
  const vault = useSelectedVault();
  const loadingDepositor = useDepositor(vault?.auth.address, vault?.address);
  if (!vault) return <p>Failed to Load</p> 
  return (
    <section className="flex flex-col justify-evenly h-full items-center">
      <h1 className="text-3xl">Deposit {vault.name}</h1>
      <CardItem
          loading={loading}
          left="Vault Network"
          right={ vault.network.name }
      />
      <CardItem
          loading={loading}
          left={`Your ${vault.symbol} Wallet balance`}
          right={ prettyNumber(vault?.userBalances?.wallet.label) }
      />
      <CardItem
          loading={loading}
          left={`Your Vault Token balance`}
          right={ prettyNumber(vault?.userBalances?.vault.label) }
      />
      { loadingDepositor ? <div>LOADING...</div> :
        vault.auth.isDepositor ? <DepositInput vault={vault} /> : <MerkleVerify vault={vault}/>}
    </section>     
  )
}

export default DepositCard;