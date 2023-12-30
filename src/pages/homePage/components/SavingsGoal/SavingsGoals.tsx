import './SavingsGoals.scss'
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";
import {Button} from "primereact/button";
import {useState} from "react";
import {GoalType, SavingsGoal} from "../../../../types.ts";
import CreateSavingsGoalModal from "../CreateSavingsGoalModal/CreateSavingsGoalModal.tsx";
import SavingsGoalCard from "./SavingsGoalCard/SavingsGoalCard.tsx";
import SavingsGoalsHistoryModal from "../SavingsGoalsHistoryModal/SavingsGoalsHistoryModal.tsx";

function SavingsGoals() {
    const [createGoalDialog, setCreateGoalDialog] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);
    const {goals, user} = useSelector((state: RootState) => {
        return {goals: state.goals, user: state.user};
    })

    function filterGoals(goals: SavingsGoal[], type: GoalType) {
        return goals.filter((goal) => {
            if (type === GoalType.CURRENT) {
                return new Date(goal.deadline) >= new Date();
            } else {
                return new Date(goal.deadline) < new Date();
            }
        })
    }

    let currentGoals = filterGoals(goals, GoalType.CURRENT);


    return (
        <div className="savings-goals">
            <div className="savings-goals__header">
                <h2>Your savings goals</h2>
                <div className={"savings-goals__header__buttons"}>
                    <Button
                        size="small"
                        onClick={() => setCreateGoalDialog(true)}
                    >
                        Create a goal
                    </Button>
                    <Button
                        size="small"
                        onClick={() => setHistoryDialog(true)}
                    >
                        See more
                    </Button>
                </div>
            </div>
            {currentGoals.length ? <ul className="savings-goals__cards">
                    {currentGoals.map((goal) => (
                        <li key={goal.id}>
                            <SavingsGoalCard goal={goal} currency={user.currency}/>
                        </li>
                    ))}
                </ul>
                :
                <div className="savings-goals__cards--empty">
                    <h3>No active goals found</h3>
                    <p>Add your savings goal!</p>
                </div>
            }
            <CreateSavingsGoalModal visible={createGoalDialog} setVisible={setCreateGoalDialog}/>
            <SavingsGoalsHistoryModal visible={historyDialog} setVisible={setHistoryDialog}
                                      goals={filterGoals(goals, GoalType.PAST)} currency={user.currency}/>
        </div>
    );
}

export default SavingsGoals;