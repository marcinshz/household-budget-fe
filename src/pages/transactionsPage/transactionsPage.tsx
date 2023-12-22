import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import Navbar from "../homePage/components/Navbar/Navbar.tsx";
import WalletList from "../homePage/components/walletList/walletList.tsx";
import {cloneDeep} from "lodash";
import {toggleWallet} from "../../redux/walletSlice.ts";
import './transactionsPage.scss';
import {useEffect} from "react";
import {getTransactionsThunk} from "../../redux/thunks.ts";
import TransactionVisualisations from "../homePage/components/TransactionVisualisations/TransactionVisualisations.tsx";

function TransactionsPage() {
    const {user, wallets, transactions} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets, transactions: state.transactions};
    })
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (wallets.length)
            dispatch(getTransactionsThunk({
                id: user.id,
                wallets: wallets
            }));
    }, [wallets]);

    function handleWalletChange(index: number) {
        let list = cloneDeep(wallets);
        list[index].checked = !list[index].checked;
        dispatch(toggleWallet(list));
    }

    return (
        <div className="transactions-page">
            <Navbar user={user}/>
            <div className="transactions-page__content">
                <WalletList walletList={wallets} handleWalletChange={handleWalletChange}/>
                <div className="transactions-page__content__visualisations">
                    {transactions.incomesGrouped && transactions.expensesGrouped &&
                        <TransactionVisualisations
                            transactionsGrouped={{
                                incomes: transactions.incomesGrouped,
                                expenses: transactions.expensesGrouped
                            }}
                            current={true}
                        />}
                </div>
            </div>
        </div>
    );
}

export default TransactionsPage;