import './ExpenseLimits.scss';
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import CreateLimitModal from "../CreateLimitModal/CreateLimitModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {Card} from "primereact/card";
import {format} from "date-fns";
import {ProgressBar} from "primereact/progressbar";
import {getLimitsThunk} from "../../../../redux/thunks.ts";

function ExpenseLimits() {
    const [dialog, setDialog] = useState(false);
    const {user, limits, transactions} = useSelector((state: RootState) => {
        return {user: state.user, limits: state.limits, transactions: state.transactions};
    })
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getLimitsThunk(user.id))
    }, [transactions]);
    return (
        <div className="expense-limits">
            <div className="expense-limits__header">
                <h2>Your expense limits</h2>
                <div className={"expense-limits__header__buttons"}>
                    <Button
                        size="small"
                        onClick={() => setDialog(true)}
                    >
                        Create limit
                    </Button>
                </div>
            </div>
            {limits.length ? <div className="expense-limits__cards">
                    {limits.map((limit) => (
                        <Card title={limit.category.name}
                              subTitle={format(new Date(limit.start), 'dd.MM.yyyy') + " - " + format(new Date(limit.deadline), 'dd.MM.yyyy')}
                              key={limit.id}>
                            <div className="expense-limits__cards__card">
                                <ProgressBar value={Math.round(limit.currentValue / limit.value * 100)}/>
                                <div className="expense-limits__cards__card__values">
                                    <h3>{limit.currentValue + ' ' + user.currency}</h3>
                                    <h3>{limit.value + ' ' + user.currency}</h3>
                                </div>
                            </div>

                        </Card>
                    ))}
                </div>
                :
                <div className="expense-limits__cards--empty">
                    <h3>No limits found</h3>
                    <p>Add your expense limit!</p>
                </div>
            }
            <CreateLimitModal visible={dialog} setVisible={setDialog}/>
        </div>
    );
}

export default ExpenseLimits;