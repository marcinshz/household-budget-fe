import { Button } from 'primereact/button';
import './overview.scss';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { useDispatch, useSelector } from 'react-redux';
import { createWalletThunk, getWalletsThunk } from '../../../../redux/thunks';
import { CreateWalletDto, Wallet } from '../../../../types';
import { AppDispatch, RootState } from '../../../../redux/store';
import { Card } from 'primereact/card';

function Overview(props: { userId: string }) {
    const { userId } = props;
    const [dialog, setDialog] = useState(false);
    const [name, setName] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const wallets = useSelector((state: RootState) => state.wallets);
    let currency = "";//pobrac z localstorage

    useEffect(() => {
        dispatch(getWalletsThunk(userId));
    }, [userId])

    return (
        <div className="overview">
            <div className="overview__header">
                <h2>Overview</h2>
                <Button size="small" onClick={() => setDialog(true)}>Add wallet</Button>
            </div>
            <div className="overview__cards">
                {wallets.map((wallet: Wallet) => (
                    <Card title={wallet.name} subTitle={wallet.value + currency} style={{ minWidth: '150px' }} />
                ))}
            </div>
            <Dialog header="Add new wallet" visible={dialog} style={{ width: '75vw', maxWidth: '960px' }} onHide={() => setDialog(false)}>
                <div className="add-wallet">
                    <div className="add-wallet__wallet-name-container">
                        <label htmlFor="wallet-name">Wallet name</label>
                        <InputText id="wallet-name" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <Button onClick={async () => { await dispatch(createWalletThunk(new CreateWalletDto(name, userId))).then(() => setDialog(false)) }} style={{ justifyContent: 'center' }}>Add wallet</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default Overview