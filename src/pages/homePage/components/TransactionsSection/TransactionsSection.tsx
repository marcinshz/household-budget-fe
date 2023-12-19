import {Expense, Income, TransactionType} from "../../../../types.ts";
import TransactionList from "../TransactionList/TransactionList.tsx";
import './TransactionsSection.scss';

type TransactionsSectionProps = {
    incomes: Income[] | Expense[];
    expenses: Income[] | Expense[];
}

function TransactionsSection({incomes, expenses}: TransactionsSectionProps) {
    return (
        <div className="transactions-section">
            <div className="transactions-section__row">
                <div className="transactions-section__column">
                    <TransactionList transactions={incomes} type={TransactionType.INCOME}/>
                </div>
                <div className="transactions-section__column">
                    <TransactionList transactions={expenses} type={TransactionType.EXPENSE}/>
                </div>
            </div>
        </div>
    );
}

export default TransactionsSection;