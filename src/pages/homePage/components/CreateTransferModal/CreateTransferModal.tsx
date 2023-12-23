import {useEffect, useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputNumber, InputNumberChangeEvent} from "primereact/inputnumber";
import {CreateTransferDto, ModalProps} from "../../../../types.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {Dropdown, DropdownChangeEvent} from "primereact/dropdown";
import './CreateTransferModal.scss';
import {Button} from "primereact/button";
import {createTransferThunk, getWalletsThunk} from "../../../../redux/thunks.ts";

function CreateTransferModal({visible, setVisible}: ModalProps) {
    const [value, setValue] = useState<number>(0);
    const {user, wallets, categories} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets, categories: state.categories};
    })
    const dispatch = useDispatch<AppDispatch>();
    const [sourceWalletId, setSourceWalletId] = useState<string>("");
    const [targetWalletId, setTargetWalletId] = useState<string>("");
    const [valueError, setValueError] = useState(false);
    const [sameWalletError, setSameWalletError] = useState(false);
    const handleValueChange = (e: InputNumberChangeEvent) => {
        if (e.value) {
            setValueError(false);
            let source = wallets.find((wallet) => {
                return wallet.id === sourceWalletId;
            })
            let target = wallets.find((wallet) => {
                return wallet.id === targetWalletId;
            })
            if (source && target && source.balance - value >= 0) {
                setValue(e.value);
            } else {
                setValueError(true);
            }
        }

    }
    const handleWalletChange = (e: DropdownChangeEvent, type: string) => {
        setSameWalletError(false);
        if (type === "source") setSourceWalletId(e.value);
        if (type === "target") setTargetWalletId(e.value);
    }

    useEffect(() => {
        if (sourceWalletId !== "" && targetWalletId !== "" && sourceWalletId === targetWalletId) setSameWalletError(true);
    }, [sourceWalletId, targetWalletId]);

    const handleSubmit = async () => {
        let sourceCategory = categories.expenses.find((category) => {
            return category.name === "Internal Transfer"
        })
        let targetCategory = categories.incomes.find((category) => {
            return category.name === "Internal Transfer"
        })
        if (sourceWalletId && targetWalletId && sourceCategory && targetCategory && value) {
            await dispatch(createTransferThunk(new CreateTransferDto(sourceWalletId, targetWalletId, sourceCategory.id, targetCategory.id, value))).then(() => {
                dispatch(getWalletsThunk(user.id));
                setVisible(false);
            });
        }
    }

    return (
        <Dialog header="Transfer funds" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            <div className="transfer-funds">
                <div className="transfer-funds__wallet-input-container">
                    <label htmlFor="source-wallet">Source Wallet</label>
                    <Dropdown
                        id="source-wallet"
                        value={sourceWalletId}
                        onChange={(e) => handleWalletChange(e, 'source')}
                        options={wallets}
                        optionLabel={'name'}
                        optionValue={'id'}
                        className={`${sameWalletError ? 'p-invalid' : ''}`}
                    />
                </div>
                <div className="transfer-funds__wallet-input-container">
                    <label htmlFor="target-wallet">Target Wallet</label>
                    <Dropdown
                        id="target-wallet"
                        value={targetWalletId}
                        onChange={(e) => handleWalletChange(e, 'target')}
                        options={wallets}
                        optionLabel={'name'}
                        optionValue={'id'}
                        className={`${sameWalletError ? 'p-invalid' : ''}`}
                    />
                </div>
                <div className="transfer-funds__wallet-input-container">
                    <label htmlFor="transfer-value">Value</label>
                    <InputNumber
                        id={"transfer-value"}
                        mode="currency"
                        currency="PLN"
                        inputId="currency-pl"
                        value={value}
                        onChange={(e) => handleValueChange(e)}
                        className={`${valueError ? 'p-invalid' : ''}`}
                    />
                </div>
                <Button onClick={handleSubmit} style={{justifyContent: 'center'}}>Transfer</Button>
            </div>
        </Dialog>
    );
}

export default CreateTransferModal;