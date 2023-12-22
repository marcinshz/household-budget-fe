import {Button} from 'primereact/button';
import './walletList.scss';
import {useState} from 'react';
import CheckboxCard from "./components/CheckboxCard/CheckboxCard.tsx";
import CreateWalletModal from "../CreateWalletModal/CreateWalletModal.tsx";
import {WalletListItem, WalletModalVariants} from "../../../../types.ts";
import CreateTransferModal from "../CreateTransferModal/CreateTransferModal.tsx";
import RemoveWalletModal from "../RemoveWalletModal/RemoveWalletModal.tsx";

interface OverviewProps {
    walletList: WalletListItem[];
    handleWalletChange: Function;
}

function WalletList({walletList, handleWalletChange}: OverviewProps) {
    const [dialog, setDialog] = useState(false);
    const [dialogVariant, setDialogVariant] = useState<WalletModalVariants>();
    let currency = "EUR";//pobrac z localstorage

    const handleWalletAction = (variant: WalletModalVariants) => {
        setDialogVariant(variant);
        setDialog(true);
    }

    return (
        <div className="wallet-list">
            <div className="wallet-list__header">
                <h2>Your wallets</h2>
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
            {walletList.length ? <div className="wallet-list__cards">
                    {walletList.map((wallet, index) => (
                        <CheckboxCard
                            title={wallet.name}
                            subTitle={wallet.balanceStamps[0] ? wallet.balanceStamps[0].balance + currency : 0 + currency}
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