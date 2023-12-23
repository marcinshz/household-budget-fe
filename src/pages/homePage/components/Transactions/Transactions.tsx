import {TransactionType} from "../../../../types.ts";
import TransactionList from "../TransactionList/TransactionList.tsx";
import './Transactions.scss';
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";


function Transactions() {
    const {incomes, expenses} = useSelector((state: RootState) => {
        return {incomes: state.transactions.incomes, expenses: state.transactions.expenses};
    })
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