import {Button} from 'primereact/button';
import './walletList.scss';
import {useState} from 'react';
import CheckboxCard from "./components/CheckboxCard/CheckboxCard.tsx";
import CreateWalletModal from "../CreateWalletModal/CreateWalletModal.tsx";
import {WalletListItem, WalletModalVariants} from "../../../../types.ts";
import CreateTransferModal from "../CreateTransferModal/CreateTransferModal.tsx";
import RemoveWalletModal from "../RemoveWalletModal/RemoveWalletModal.tsx";
import {cloneDeep} from "lodash";
import {toggleWallet} from "../../../../redux/walletSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";

function WalletList() {
    const [dialog, setDialog] = useState(false);
    const [dialogVariant, setDialogVariant] = useState<WalletModalVariants>();
    let currency = "EUR";//pobrac z localstorage
    const {wallets} = useSelector((state: RootState) => {
        return {wallets: state.wallets};
    })
    const dispatch = useDispatch<AppDispatch>();
    const handleWalletAction = (variant: WalletModalVariants) => {
        setDialogVariant(variant);
        setDialog(true);
    }

    function handleWalletChange(index: number) {
        let list = cloneDeep(wallets);
        list[index].checked = !list[index].checked;
        dispatch(toggleWallet(list));
    }

    function getLatestBalance(wallet: WalletListItem) {
        const copy = cloneDeep(wallet);
        const tmp = copy.balanceStamps.pop();
        if (tmp) return tmp.balance;
        return 0;
    }

    return (
        <div className="wallet-list">
            <div className="wallet-list__header">
                <h2>Wallets</h2>
                <div className="wallet-list__header__buttons">
                    <Button
                        size="small"
                        onClick={() => handleWalletAction(WalletModalVariants.CREATE)}
                    >
                        Add wallet
                    </Button>
                    <Button
                        size="small"
                        severity="secondary"
                        onClick={() => handleWalletAction(WalletModalVariants.TRANSFER)}
                    >
                        Transfer funds
                    </Button>
                    <Button
                        size="small"
                        severity="help"
                        onClick={() => handleWalletAction(WalletModalVariants.REMOVE)}
                    >
                        Remove wallet
                    </Button>
                </div>
            </div>
            {wallets.length ? <div className="wallet-list__cards">
                    {wallets.map((wallet, index) => (
                        <CheckboxCard
                            title={wallet.name}
                            subTitle={getLatestBalance(wallet) + currency}
                            checked={wallet.checked}
                            onChange={(_e) => handleWalletChange(index)} key={wallet.id}
                        />
                    ))}
                </div>
                :
                <div className="wallet-list__cards--empty">
                    <h3>There is no wallets yet...</h3>
                    <p>Add your first wallet!</p>
                </div>
            }
            {dialogVariant === WalletModalVariants.CREATE &&
                <CreateWalletModal visible={dialog} setVisible={setDialog}/>}
            {dialogVariant === WalletModalVariants.TRANSFER &&
                <CreateTransferModal visible={dialog} setVisible={setDialog}/>}
            {dialogVariant === WalletModalVariants.REMOVE &&
                <RemoveWalletModal visible={dialog} setVisible={setDialog}/>}
        </div>
    )
}

export default WalletList;