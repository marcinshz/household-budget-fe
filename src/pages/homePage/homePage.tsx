import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import './homePage.scss'
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store";
import WalletList from "./components/walletList/walletList.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import Transactions from "./components/Transactions/Transactions.tsx";
import TransactionVisualisations from "./components/TransactionVisualisations/TransactionVisualisations.tsx";
import {toggleWallet} from "../../redux/walletSlice.ts";
import {cloneDeep} from 'lodash';
import {getTransactionsThunk} from "../../redux/thunks.ts";
import ExpenseLimits from "./components/ExpenseLimits/ExpenseLimits.tsx";

function HomePage() {
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
        <div className="home-page">
            <Navbar user={user}/>
            <div className="home-page__content">
                <WalletList walletList={wallets} handleWalletChange={handleWalletChange}/>
                <ExpenseLimits/>
                <Transactions
                    incomes={transactions.incomes}
                    expenses={transactions.expenses}
                />
                <div className={"home-page__content__this-month"}>
                    {transactions.incomesGrouped && transactions.expensesGrouped &&
                        <TransactionVisualisations
                            transactionsGrouped={{
                                incomes: transactions.incomesGrouped,
                                expenses: transactions.expensesGrouped
                            }}
                            current={true}
                            homePage={true}
                        />}
                </div>
            </div>
        </div>
    )
}

export default HomePage
