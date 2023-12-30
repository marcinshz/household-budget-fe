import {useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {createWalletThunk} from "../../../../redux/thunks.ts";
import {CreateWalletDto, ModalProps} from "../../../../types.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import './CreateWalletModal.scss';

function CreateWalletModal({visible, setVisible}: ModalProps) {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => {
        return state.user;
    })
    return (
        <Dialog header="Add new wallet" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            <div className="add-wallet">
                <div className="add-wallet__wallet-input-container">
                    <label htmlFor="wallet-name">Wallet name</label>
                    <InputText id="wallet-name" onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className="add-wallet__wallet-input-container">
                    <label htmlFor="wallet-balance">Balance</label>
                    <InputNumber
                        id={"wallet-balance"}
                        mode="currency"
                        currency={user.currency}
                        inputId="currency-pl"
                        value={balance}
                        onChange={(e) => {
                            if (e.value) setBalance(e.value);
                        }}
                    />
                </div>
                <Button onClick={async () => {
                    await dispatch(createWalletThunk(new CreateWalletDto(name, user.id, balance))).then(() => setVisible(false))
                }} style={{justifyContent: 'center'}}>Create wallet</Button>
            </div>
        </Dialog>
    );
}

export default CreateWalletModal;