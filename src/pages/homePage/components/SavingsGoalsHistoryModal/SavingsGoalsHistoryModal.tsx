import {useState} from 'react';
import {Dialog} from "primereact/dialog";
import {Paginator} from "primereact/paginator";
import {ModalProps, SavingsGoal} from "../../../../types.ts";
import SavingsGoalCard from "../SavingsGoal/SavingsGoalCard/SavingsGoalCard.tsx";
import './SavingsGoalsHistoryModal.scss';

export interface SavingsGoalssHistoryModalProps extends ModalProps {
    goals: SavingsGoal[];
    currency: string
}

function SavingsGoalsHistoryModal({visible, setVisible, goals, currency}: SavingsGoalssHistoryModalProps) {
    const [first, setFirst] = useState(0);

    const handlePageChange = (event) => {
        setFirst(event.first);
    };

    return (
        <Dialog header="Savings Goals history" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            {(goals && goals.length) ? <ul className="savings-goals-history">
                    {goals.map((goal) => (
                        <li key={goal.id}>
                            <SavingsGoalCard goal={goal} currency={currency}/>
                        </li>
                    ))}
                </ul>
                :
                <div className="savings-goals-history__cards--empty">
                    <h3>No past goals found</h3>
                </div>
            }
            <Paginator first={first} rows={3} totalRecords={goals.length} onPageChange={handlePageChange}
                       alwaysShow={false} style={{backgroundColor: '#fcfcfc'}}/>
        </Dialog>
    );
}

export default SavingsGoalsHistoryModal;