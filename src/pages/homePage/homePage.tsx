import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import './homePage.scss'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import WalletList from "./components/walletList/walletList.tsx";
import Navbar from "./components/navbar/navbar";
import {getOverview} from "../../DataService.tsx";
import {Expense, Income, TransactionsGrouped, WalletListItem} from "../../types.ts";
import {SelectButton} from "primereact/selectbutton";
import TransactionsSection from "./components/TransactionsSection/TransactionsSection.tsx";
import {Calendar} from "primereact/calendar";

function HomePage() {
    const {user, wallets} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets};
    })
    const [walletList, setWalletList] = useState<WalletListItem[]>([]);
    const [transactions, setTransactions] = useState<{ incomes: Income[], expenses: Expense[] }>({
        incomes: [],
        expenses: []
    });
    const [period, setPeriod] = useState('Last month');
    const [pies, setPies] = useState<{ incomes: TransactionsGrouped, expenses: TransactionsGrouped }>({
        incomes: {
            labels: [],
            datasets: []
        },
        expenses: {
            labels: [],
            datasets: []
        }
    })
    const [date, setDate] = useState<Date>();

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
        if (walletList.length && period)
            getIncomeExpenseOverview();
    }, [walletList, period]);


    async function getIncomeExpenseOverview() {
        let tmp = await getOverview(user.id, walletList, period);
        setTransactions({
            incomes: tmp.incomes,
            expenses: tmp.expenses
        });
        setPies(tmp.pies);
    }


    function handleWalletChange(index: number) {
        let list = [...walletList];
        list[index].checked = !list[index].checked;
        setWalletList(list);
    }


    return (
        <div className="home-page">
            {(user && user.id) ?
                <>
                    <Navbar user={user}/>
                    <div className="home-page__content">
                        <WalletList walletList={walletList} handleWalletChange={handleWalletChange}/>
                        <div className={"home-page__content__filters"}>
                            <SelectButton
                                options={['Last month', 'Last 3 months', 'Last 6 months', 'Last year']}
                                value={period}
                                onChange={(e) => setPeriod(e.value)}
                            />
                            <Calendar value={date} required={false} showIcon={true} view={"month"}
                                      onChange={e => setDate(e.value)} maxDate={new Date()}/>
                        </div>
                        <TransactionsSection
                            incomes={transactions.incomes}
                            expenses={transactions.expenses}
                            pies={pies}
                        />
                    </div>
                </>
                :
                <></>
            }
        </div>
    )
}

export default HomePage
