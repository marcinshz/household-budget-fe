import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import './homePage.scss'
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import WalletList from "./components/walletList/walletList.tsx";
import Navbar from "./components/navbar/navbar";
import {getOverview} from "../../DataService.tsx";
import {Expense, Income, StackBarData, StackBarVariant, TransactionsGroupedTest, WalletListItem} from "../../types.ts";
import TransactionsSection from "./components/TransactionsSection/TransactionsSection.tsx";
import {Chart} from "primereact/chart";
import {Button} from "primereact/button";
import {SelectButton} from "primereact/selectbutton";

function HomePage() {
    const {user, wallets} = useSelector((state: RootState) => {
        return {user: state.user, wallets: state.wallets};
    })
    const [walletList, setWalletList] = useState<WalletListItem[]>([]);
    const [transactions, setTransactions] = useState<{ incomes: Income[], expenses: Expense[] }>({
        incomes: [],
        expenses: []
    });
    const [stackData, setStackData] = useState<{ incomes: StackBarData, expenses: StackBarData }>({
        incomes: {
            labels: [],
            datasets: []
        },
        expenses: {
            labels: [],
            datasets: []
        }
    })
    const [stackBarVariant, setStackBarVariant] = useState<StackBarVariant>(StackBarVariant.EXPENSE);

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
        //setPies(tmp.pies);
        //setHiistory({incomes: tmp.incomesGrouped, expenses: tmp.expensesGrouped});
        //setTransactionsGrouped({incomes: tmp.incomesGrouped, expenses: tmp.expensesGrouped});
        //setTransactionsGroupedTest({incomes: tmp.incomesGrouped, expenses: tmp.expensesGrouped});
        createStackData(tmp.incomesGrouped, tmp.expensesGrouped);
    }


    function handleWalletChange(index: number) {
        let list = [...walletList];
        list[index].checked = !list[index].checked;
        setWalletList(list);
    }

    function createStackData(incomes: TransactionsGroupedTest, expenses: TransactionsGroupedTest) {
        const date = new Date();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth() + 1;
        const currentDay = date.getDate();

        let incomeCategoryLabels: string[] = [];
        let expenseCategoryLabels: string[] = [];
        let incomeCategoryValues: number[][] = [];
        let expenseCategoryValues: number[][] = [];

        if (incomes && incomes[currentYear] && incomes[currentYear].months && incomes[currentYear].months[currentMonth] && incomes[currentYear].months[currentMonth].overview) {
            incomes[currentYear].months[currentMonth].overview.labels.forEach((label) => {
                if (!incomeCategoryLabels.includes(label)) {
                    incomeCategoryLabels.push(label);
                }
            })

            incomeCategoryValues = Array.from({length: incomeCategoryLabels.length}, () => Array.from({length: currentDay}, () => 0));

            incomeCategoryLabels.forEach((label, index) => {
                for (const [_, day] of Object.entries(incomes[currentYear].months[currentMonth].days)) {
                    day.list.forEach((transaction) => {
                        const tmpId = new Date(transaction.createdAt).getDate() - 1;
                        if (label === transaction.category.name) {
                            incomeCategoryValues[index][tmpId] = incomeCategoryValues[index][tmpId] + transaction.value;
                        }
                    })
                }
            })

        }

        if (expenses && expenses[currentYear] && expenses[currentYear].months && expenses[currentYear].months[currentMonth] && expenses[currentYear].months[currentMonth].overview) {
            expenses[currentYear].months[currentMonth].overview.labels.forEach((label) => {
                if (!expenseCategoryLabels.includes(label)) {
                    expenseCategoryLabels.push(label);
                }
            })

            expenseCategoryValues = Array.from({length: expenseCategoryLabels.length}, () => Array.from({length: currentDay}, () => 0));
//1-710 6-110 16-310 19-32,200
            expenseCategoryLabels.forEach((label, index) => {
                for (const [_, day] of Object.entries(expenses[currentYear].months[currentMonth].days)) {
                    day.list.forEach((transaction) => {
                        const tmpId = new Date(transaction.createdAt).getDate() - 1;
                        if (label === transaction.category.name) {
                            expenseCategoryValues[index][tmpId] = expenseCategoryValues[index][tmpId] + transaction.value;
                        }
                    })
                }
            })
        }
        const dayLabels = Array.from({length: currentDay}, (_, index) => (index + 1).toString() + "." + currentMonth);

        let incomeStackData: StackBarData = {
            labels: dayLabels,
            datasets: incomeCategoryLabels.map((label, index) => {
                return {
                    label: label,
                    data: incomeCategoryValues[index],
                    stack: "Incomes"
                }
            })
        }

        let expenseStackData: StackBarData = {
            labels: dayLabels,
            datasets: expenseCategoryLabels.map((label, index) => {
                return {
                    label: label,
                    data: expenseCategoryValues[index],
                    stack: "Expenses"
                }
            })
        }

        setStackData({
            incomes: incomeStackData,
            expenses: expenseStackData
        })
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
                    <div className={"home-page__content__this-month__header"}>
                        <h2>This month</h2>
                        <Button size="small" label="See more"/>
                    </div>
                    <Chart type="bar"
                           data={stackBarVariant === StackBarVariant.INCOME ? stackData.incomes : stackData.expenses}
                           options={{
                               type: 'bar',
                               options: {
                                   plugins: {
                                       title: {
                                           display: true,
                                           text: 'Transactions History'
                                       },
                                   },
                                   responsive: true,
                                   interaction: {
                                       intersect: false,
                                   },
                                   scales: {
                                       y: {
                                           stacked: true,
                                           beginAtZero: true
                                       }
                                   }
                               }
                           }}/>
                    <SelectButton value={stackBarVariant} onChange={(e) => setStackBarVariant(e.value)}
                                  options={[StackBarVariant.EXPENSE, StackBarVariant.INCOME]}/>
                </div>
            </div>
        </div>
    )
}

export default HomePage
