import {Expense, Income, TransactionType} from "../../../../types.ts";
import TransactionList from "../TransactionList/TransactionList.tsx";
import './Transactions.scss';

type TransactionsProps = {
    incomes: Income[] | Expense[];
    expenses: Income[] | Expense[];
}

function Transactions({incomes, expenses}: TransactionsProps) {
    return (
        <div className="transactions">
            <div className="transactions__row">
                <div className="transactions__column">
                    <TransactionList transactions={incomes} type={TransactionType.INCOME}/>
                </div>
                <div className="transactions__column">
                    <TransactionList transactions={expenses} type={TransactionType.EXPENSE}/>
                </div>
            </div>
        </div>
    );
}

export default Transactions;