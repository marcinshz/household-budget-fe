import {useState} from 'react';
import {Dialog} from "primereact/dialog";
import {InputNumber} from "primereact/inputnumber";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {Category, CreateTransactionDto, TransactionType} from "../../../../../types.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../../redux/store.ts";
import './createTransactionModal.scss';
import {InputTextarea} from "primereact/inputtextarea";
import {createTransaction} from "../../../../../DataService.tsx";
import {getGoalsThunk, getLimitsThunk, getWalletsThunk} from "../../../../../redux/thunks.ts";

interface ModalProps {
    type: TransactionType,
    visible: boolean,
    setVisible: Function
}

function CreateTransactionModal({type, visible, setVisible}: ModalProps) {
    const [value, setValue] = useState(0);
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [walletId, setWalletId] = useState("");
    const {user, wallets, categories} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets, categories: state.categories};
    })
    const dispatch = useDispatch<AppDispatch>();

    async function handleSubmit() {
        if (value && name && categoryId && walletId) {
            const transaction = new CreateTransactionDto(walletId, name, value, categoryId, type, note);
            createTransaction(transaction).then((response) => {
                if (response) {
                    dispatch(getWalletsThunk(user.id));
                    dispatch(getGoalsThunk(user.id));
                    if (type === TransactionType.EXPENSE) dispatch(getLimitsThunk(user.id));
                    setVisible(false)
                }
            })
        }
    }

    function filterCategories(categories: Category[]) {
        return categories.filter((category) => category.name !== 'Internal Transfer');
    }

    return (
        <Dialog
            header={`Add new ${type}`}
            visible={visible}
            style={{width: '90vw', maxWidth: '600px'}}
            onHide={() => setVisible(false)}
        >
            <div className="create-transaction-modal">
                <div className="create-transaction-modal__container">
                    <div className="create-transaction-modal__container__input">
                        <label htmlFor={"value"}>Value</label>
                        <InputNumber
                            id={"value"}
                            mode="currency"
                            currency="PLN"
                            inputId="currency-pl"
                            value={value}
                            onChange={(e) => {
                                if (e.value) setValue(e.value);
                            }}
                        />
                    </div>

                    <div className="create-transaction-modal__container__input">
                        <label htmlFor="name">Name</label>
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}/>
                    </div>


                    <div className="create-transaction-modal__container__input">
                        <label htmlFor='category'>Category</label>
                        <Dropdown
                            id="category"
                            value={categoryId}
                            onChange={
                                (e) => {
                                    setCategoryId(e.value);
                                }}
                            options={type === TransactionType.INCOME ? filterCategories(categories.incomes) : filterCategories(categories.expenses)}
                            optionLabel={'name'}
                            optionValue={'id'}
                        />
                    </div>

                    <div className="create-transaction-modal__container__input">
                        <label htmlFor='wallet'>Wallet</label>
                        <Dropdown
                            id="wallet"
                            value={walletId}
                            onChange={(e) => {
                                setWalletId(e.value)
                            }}
                            options={wallets}
                            optionLabel={'name'}
                            optionValue={'id'}/>
                    </div>

                    <div className="create-transaction-modal__container__input">
                        <label htmlFor='note'>Note</label>
                        <InputTextarea
                            id="note"
                            autoResize
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={5}
                            cols={30}
                            required={false}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    style={{justifyContent: 'center'}}
                    disabled={name === "" || categoryId === "" || walletId === ""}
                >
                    Add {type}
                </Button>
            </div>
        </Dialog>
    );
}

export default CreateTransactionModal;