import './ExpenseLimits.scss';
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import CreateLimitModal from "../CreateLimitModal/CreateLimitModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {getLimitsThunk} from "../../../../redux/thunks.ts";
import {Limit, LimitType} from "../../../../types.ts";
import ExpenseLimitCard from "./ExpenseLimitCard/ExpenseLimitCard.tsx";
import ExpenseLimitsHistoryModal from "../ExpenseLimitsHistoryModal/ExpenseLimitsHistoryModal.tsx";

function ExpenseLimits() {
    const [createLimitDialog, setCreateLimitDialog] = useState(false);
    const [historyDialog, setHistoryDialog] = useState(false);
    const {user, limits, transactions} = useSelector((state: RootState) => {
        return {user: state.user, limits: state.limits, transactions: state.transactions};
    })
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getLimitsThunk(user.id))
    }, [transactions]);

    function filterLimits(limits: Limit[], type: LimitType) {
        return limits.filter((limit) => {
            if (type === LimitType.COMPLETED) {
                return new Date(limit.deadline) < new Date();
            } else {
                return new Date(limit.deadline) >= new Date();
            }
        })
    }

    let currentLimits = filterLimits(limits, LimitType.CURRENT);

    return (
        <div className="expense-limits">
            <div className="expense-limits__header">
                <h2>Your expense limits</h2>
                <div className={"expense-limits__header__buttons"}>
                    <Button
                        size="small"
                        onClick={() => setCreateLimitDialog(true)}
                    >
                        Create limit
                    </Button>
                    <Button
                        size="small"
                        onClick={() => setHistoryDialog(true)}
                    >
                        See more
                    </Button>
                </div>
            </div>
            {currentLimits.length ? <div className="expense-limits__cards">
                    {currentLimits.map((limit) => (
                        <ExpenseLimitCard limit={limit} currency={user.currency}/>
                    ))}
                </div>
                :
                <div className="expense-limits__cards--empty">
                    <h3>No active limits found</h3>
                    <p>Add your expense limit!</p>
                </div>
            }
            <CreateLimitModal visible={createLimitDialog} setVisible={setCreateLimitDialog}/>
            <ExpenseLimitsHistoryModal visible={historyDialog} setVisible={setHistoryDialog}
                                       limits={filterLimits(limits, LimitType.COMPLETED)} currency={user.currency}/>
        </div>
    );
}

export default ExpenseLimits;