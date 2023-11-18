import PieChart from "../pieChart/pieChart.tsx";
import {Expense, Income, TransactionsGrouped, TransactionType} from "../../../../types.ts";
import TransactionList from "../TransactionList/TransactionList.tsx";
import './TransactionsSection.scss';

type TransactionsSectionProps = {
    incomes: Income[] | Expense[];
    expenses: Income[] | Expense[];
    pies: {
        incomes: TransactionsGrouped,
        expenses: TransactionsGrouped
    };
}

function TransactionsSection({incomes, expenses, pies}: TransactionsSectionProps) {
    return (
        <div className="transactions-section">
            <h2 className="transactions-section__header">Transactions</h2>
            <div className="transactions-section__row">
                <div className="transactions-section__column">
                    <PieChart data={pies.incomes}/>
                    <TransactionList transactions={incomes} type={TransactionType.INCOME}/>
                </div>
                <div className="transactions-section__column">
                    <PieChart data={pies.expenses}/>
                    <TransactionList transactions={expenses} type={TransactionType.EXPENSE}/>
                </div>
            </div>
        </div>
    );
}

export default TransactionsSection;