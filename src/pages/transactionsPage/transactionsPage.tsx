import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import Navbar from "../homePage/components/Navbar/Navbar.tsx";
import WalletList from "../homePage/components/walletList/walletList.tsx";
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

    return (
        <div className="transactions-page">
            <Navbar user={user}/>
            <div className="transactions-page__content">
                <WalletList/>
                <div className="transactions-page__content__visualisations">
                    {transactions.incomesGrouped && transactions.expensesGrouped &&
                        <TransactionVisualisations
                            transactionsGrouped={{
                                incomes: transactions.incomesGrouped,
                                expenses: transactions.expensesGrouped
                            }}
                        />}
                </div>
            </div>
        </div>
    );
}

export default TransactionsPage;