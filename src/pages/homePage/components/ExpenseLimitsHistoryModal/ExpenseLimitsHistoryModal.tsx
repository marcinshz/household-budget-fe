import './ExpenseLimitsHistoryModal.scss';
import {Limit, ModalProps} from "../../../../types.ts";
import {Dialog} from "primereact/dialog";
import ExpenseLimitCard from "../ExpenseLimits/ExpenseLimitCard/ExpenseLimitCard.tsx";
import {Paginator, PaginatorPageChangeEvent} from "primereact/paginator";
import {useState} from "react";

export interface ExpenseLimitsHistoryModalProps extends ModalProps {
    limits: Limit[];
    currency: string
}

function ExpenseLimitsHistoryModal({visible, setVisible, limits, currency}: ExpenseLimitsHistoryModalProps) {
    const [first, setFirst] = useState(0);

    const handlePageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
    };

    return (
        <Dialog header="Expense Limit history" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            {(limits && limits.length) ? <ul className="expense-limit-history">
                    {limits.map((limit) => (
                        <li key={limit.id}>
                            <ExpenseLimitCard limit={limit} currency={currency}/>
                        </li>
                    ))}
                </ul>
                :
                <div className="expense-limit-history__cards--empty">
                    <h3>No past limits found</h3>
                </div>
            }
            <Paginator first={first} rows={3} totalRecords={limits.length} onPageChange={handlePageChange}
                       alwaysShow={false} style={{backgroundColor: '#fcfcfc'}}/>
        </Dialog>
    );
}

export default ExpenseLimitsHistoryModal;