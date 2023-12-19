import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import './homePage.scss'
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import WalletList from "./components/walletList/walletList.tsx";
import Navbar from "./components/navbar/navbar";
import {getOverview} from "../../DataService.tsx";
import {Expense, Income, TransactionsGrouped} from "../../types.ts";
import TransactionsSection from "./components/TransactionsSection/TransactionsSection.tsx";
import TransactionVisualisations from "./components/TransactionVisualisations/TransactionVisualisations.tsx";
import {toggleWallet} from "../../redux/walletSlice.ts";
import {cloneDeep} from 'lodash';

function HomePage() {
    const {user, wallets} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets};
    })
    const [transactions, setTransactions] = useState<{
        incomes: Income[],
        expenses: Expense[]
    }>({
        incomes: [],
        expenses: []
    });
    const [transactionsGrouped, setTransactionsGrouped] = useState<{
        incomes: TransactionsGrouped,
        expenses: TransactionsGrouped
    }>()
    const dispatch = useDispatch();

    useEffect(() => {
        if (wallets.length)
            getIncomeExpenseOverview();
    }, [wallets]);


    async function getIncomeExpenseOverview() {
        const {incomes, incomesGrouped, expenses, expensesGrouped} = await getOverview(user.id, wallets);
        setTransactions({
            incomes: incomes,
            expenses: expenses
        });
        setTransactionsGrouped({incomes: incomesGrouped, expenses: expensesGrouped});
    }


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
                <TransactionsSection
                    incomes={transactions.incomes}
                    expenses={transactions.expenses}
                />
                <div className={"home-page__content__this-month"}>
                    {transactionsGrouped &&
                        <TransactionVisualisations
                            transactionsGrouped={transactionsGrouped}
                            current={true}
                            year={new Date().getFullYear()}
                            month={new Date().getMonth() + 1}
                        />}
                </div>
            </div>
        </div>
    )
}

export default HomePage
