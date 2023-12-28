import './SavingsGoalCard.scss';
import {SavingsGoal} from "../../../../../types.ts";
import {Card} from "primereact/card";
import {format} from "date-fns";
import {ProgressBar} from "primereact/progressbar";
import {useState} from "react";

export type SavingsGoalCardProps = {
    goal: SavingsGoal,
    currency: string;
}

function SavingsGoalCard({goal, currency}: SavingsGoalCardProps) {
    const [currentValue, setCurrentValue] = useState(0);

    return (
        <Card title={goal.name}
              subTitle={format(new Date(goal.start), 'dd.MM.yyyy') + " - " + format(new Date(goal.deadline), 'dd.MM.yyyy')}
              key={goal.id}>
            <div className="savings-goal-card">
                {goal.note.length > 0 && <p className="savings-goal-card__description">{goal.note}</p>}
                <ProgressBar value={goal.completed ? 100 : Math.round(currentValue / goal.value * 100)}/>
                {goal.completed ? <h3 className="savings-goal-card__completed">Goal completed</h3> :
                    <div className="savings-goal-card__values">
                        <h3>{currentValue + ' ' + currency}</h3>
                        <h3>{goal.value + ' ' + currency}</h3>
                    </div>}
            </div>

        </Card>
    );
}

export default SavingsGoalCard;