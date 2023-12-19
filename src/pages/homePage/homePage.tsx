import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import './homePage.scss'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import WalletList from "./components/walletList/walletList.tsx";
import Navbar from "./components/navbar/navbar";
import {getOverview} from "../../DataService.tsx";
import {Expense, Income, TransactionsGroupedTest, WalletListItem} from "../../types.ts";
import TransactionsSection from "./components/TransactionsSection/TransactionsSection.tsx";
import TransactionVisualisations from "./components/TransactionVisualisations/TransactionVisualisations.tsx";

function HomePage() {
    const {user, wallets} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets};
    })
    const [walletList, setWalletList] = useState<WalletListItem[]>([]);
    const [transactions, setTransactions] = useState<{
        incomes: Income[],
        expenses: Expense[]
    }>({
        incomes: [],
        expenses: []
    });
    const [transactionsGrouped, setTransactionsGrouped] = useState<{
        incomes: TransactionsGroupedTest,
        expenses: TransactionsGroupedTest
    }>()


    useEffect(() => {
        const tmp = wallets.map((wallet) => {
            return {
                ...wallet,
                checked: true
            }
        })
        setWalletList(tmp);
    }, [wallets])
    useEffect(() => {
        if (walletList.length)
            getIncomeExpenseOverview();
    }, [walletList]);


    async function getIncomeExpenseOverview() {
        let tmp = await getOverview(user.id, walletList);
        setTransactions({
            incomes: tmp.incomes,
            expenses: tmp.expenses
        });
        setTransactionsGrouped({incomes: tmp.incomesGrouped, expenses: tmp.expensesGrouped});
    }


    function handleWalletChange(index: number) {
        let list = [...walletList];
        list[index].checked = !list[index].checked;
        setWalletList(list);
    }

    return (
        <div className="home-page">
            <Navbar user={user}/>
            <div className="home-page__content">
                <WalletList walletList={walletList} handleWalletChange={handleWalletChange}/>
                <TransactionsSection
                    incomes={transactions.incomes}
                    expenses={transactions.expenses}
                />
                <div className={"home-page__content__this-month"}>

                    {transactionsGrouped && <TransactionVisualisations transactionsGrouped={transactionsGrouped}/>}
                </div>
            </div>
        </div>
    )
}

export default HomePage
