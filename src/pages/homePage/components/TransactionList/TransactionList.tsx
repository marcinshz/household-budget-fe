import {useState} from 'react';
import {Expense, Income, TransactionType} from "../../../../types.ts";
import {Button} from "primereact/button";
import CreateTransactionModal from "./createTransactionModal/createTransactionModal.tsx";
import {Tooltip} from "primereact/tooltip";
import './TransactionList.scss';
import {format} from 'date-fns';
import {Paginator} from "primereact/paginator";

interface TransactionListProps {
    transactions: Expense[] | Income[];
    type: TransactionType;
}

function TransactionList({transactions, type}: TransactionListProps) {
    const [modalVisible, setModalVisible] = useState(false);
    const [first, setFirst] = useState(0);

    const handlePageChange = (event) => {
        setFirst(event.first);
    };

    return (
        <div className='transaction-list'>
            <div className={'transaction-list__content'}>
                <div className="transaction-list__content__header">
                    <h2>{type === TransactionType.EXPENSE ? 'Expenses' : 'Incomes'}</h2>
                    <Button
                        rounded
                        text
                        raised
                        label='+'
                        style={{height: '30px', backgroundColor: 'white', justifyContent: 'center'}}
                        onClick={() => {
                            setModalVisible(true)
                        }}
                    />
                </div>
                {transactions.length ? <ul className="transaction-list__content__list">
                        {transactions.slice(first, first + 5).map((transaction) => (
                            <li className={`transaction-list__content__list__item`}
                                data-pr-tooltip={transaction.note /*TODO fix note*/}
                                data-pr-position="top"
                                key={transaction.id}
                            >
                                <div className="transaction-list__content__list__item__text">
                                    <div
                                        className="transaction-list__content__list__item__text__category">{transaction.category.name}</div>
                                    <div>
                                        <div className="transaction-list__content__list__item__text__timestamp">
                                            <div
                                                className="transaction-list__content__list__item__text__timestamp__date">{format(new Date(transaction.createdAt), 'dd.MM.yyyy')}</div>
                                            <div
                                                className="transaction-list__content__list__item__text__timestamp__time">{format(new Date(transaction.createdAt), 'hh:mm')}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="transaction-list__content__list__item__value">{transaction.value}</div>
                            </li>
                        ))}
                    </ul>
                    :
                    <h3>There is no data...</h3>
                }
            </div>
            <Paginator first={first} rows={5} totalRecords={transactions.length} onPageChange={handlePageChange}
                       alwaysShow={false} style={{backgroundColor: '#fcfcfc'}}/>
            <CreateTransactionModal type={type} visible={modalVisible} setVisible={setModalVisible}/>
            <Tooltip target=".transaction-list__content__list__item"/>
        </div>
    );
}

export default TransactionList;