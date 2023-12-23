import React, {useState} from 'react';
import {ModalProps} from "../../../../types.ts";
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import './RemoveWalletModal.scss';
import {removeWalletThunk} from "../../../../redux/thunks.ts";

function RemoveWalletModal({visible, setVisible}: ModalProps) {
    const [walletId, setWalletId] = React.useState("");
    const {wallets} = useSelector((state: RootState) => {
        return {wallets: state.wallets};
    })
    const [error, setError] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const handleSubmit = () => {
        if (walletId) {
            setError(false);
            dispatch(removeWalletThunk(walletId));
            setVisible(false);
        } else {
            setError(true);
        }
    }
    return (
        <Dialog header="Remove wallet" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            <div className="remove-wallet">
                <p className="remove-wallet__caution">Caution! Removing a wallet will remove all its transactions and
                    balance history.</p>
                <div className="remove-wallet__wallet-input-container">
                    <label htmlFor="source-wallet">Wallet</label>
                    <Dropdown
                        id="source-wallet"
                        value={walletId}
                        onChange={(e) => setWalletId(e.value)}
                        options={wallets}
                        optionLabel={'name'}
                        optionValue={'id'}
                        className={`${error ? 'p-invalid' : ''}`}
                    />
                </div>
                <Button onClick={handleSubmit} style={{justifyContent: 'center'}}>Remove</Button>
            </div>
        </Dialog>
    );
}

export default RemoveWalletModal;