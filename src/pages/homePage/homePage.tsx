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
import {getTransactionsThunk} from "../../redux/thunks.ts";
import ExpenseLimits from "./components/ExpenseLimits/ExpenseLimits.tsx";
import BalanceHistory from "./components/BalanceHistory/BalanceHistory.tsx";
import SavingsGoals from "./components/SavingsGoal/SavingsGoals.tsx";

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


    return (
        <div className="home-page">
            <Navbar/>
            <div className="home-page__content">
                <ExpenseLimits/>
                <SavingsGoals/>
                <WalletList/>
                <div className={"home-page__content__this-month"}>
                    {wallets && wallets.length &&
                        <BalanceHistory homePage={true}/>
                    }
                    {transactions.incomesGrouped && transactions.expensesGrouped &&
                        <TransactionVisualisations
                            transactionsGrouped={{
                                incomes: transactions.incomesGrouped,
                                expenses: transactions.expensesGrouped
                            }}
                            homePage={true}
                        />}
                </div>
                <Transactions/>
            </div>
        </div>
    )
}

export default HomePage
