import {Button} from 'primereact/button';
import './walletList.scss';
import {Dialog} from 'primereact/dialog';
import {useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {useDispatch, useSelector} from 'react-redux';
import {createWalletThunk} from '../../../../redux/thunks';
import {CreateWalletDto} from '../../../../types';
import {AppDispatch, RootState} from '../../../../redux/store';
import CheckboxCard from "./components/CheckboxCard/CheckboxCard.tsx";


interface OverviewProps {
    walletList: { id: string, name: string, balance: number, checked: boolean }[];
    handleWalletChange: Function;
}

function WalletList({walletList, handleWalletChange}: OverviewProps) {
    const userId = useSelector((state: RootState) => state.user.id)
    const [dialog, setDialog] = useState(false);
    const [name, setName] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    let currency = "EUR";//pobrac z localstorage

    return (
        <div className="wallet-list">
            <div className="wallet-list__header">
                <h2>Overview</h2>
                <Button size="small" onClick={() => setDialog(true)}>Add wallet</Button>
            </div>
            {walletList.length ? <div className="wallet-list__cards">
                    {walletList.map((wallet, index) => (
                        <CheckboxCard
                            title={wallet.name}
                            subTitle={wallet.balance + currency}
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
            <Dialog header="Add new wallet" visible={dialog} style={{width: '90vw', maxWidth: '600px'}}
                    onHide={() => setDialog(false)}>
                <div className="add-wallet">
                    <div className="add-wallet__wallet-name-container">
                        <label htmlFor="wallet-name">Wallet name</label>
                        <InputText id="wallet-name" onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <Button onClick={async () => {
                        await dispatch(createWalletThunk(new CreateWalletDto(name, userId))).then(() => setDialog(false))
                    }} style={{justifyContent: 'center'}}>Add wallet</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default WalletList;