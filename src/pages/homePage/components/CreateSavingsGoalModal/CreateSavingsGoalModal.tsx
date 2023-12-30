import './CreateSavingsGoalModal.scss';
import {CreateSavingsGoalDto, ModalProps} from "../../../../types.ts";
import {Dialog} from "primereact/dialog";
import {InputNumber} from "primereact/inputnumber";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {createGoalThunk, getWalletsThunk} from "../../../../redux/thunks.ts";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {useDispatch, useSelector} from "react-redux";

function CreateSavingsGoalModal({visible, setVisible}: ModalProps) {
    const [submitError, setSubmitError] = useState(false);
    const [value, setValue] = useState(0);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [name, setName] = useState("");
    const [note, setNote] = useState("");
    const now = new Date();
    const {user} = useSelector((state: RootState) => {
        return {user: state.user}
    })
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = () => {
        if (name && value && startDate && endDate) {
            dispatch(createGoalThunk(new CreateSavingsGoalDto(name, startDate, endDate, user.id, value, note))).then(() => {
                setVisible(false);
                dispatch(getWalletsThunk(user.id));
            })
        } else {
            setSubmitError(true);
        }
    }

    return (
        <Dialog header="Create savings goal" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            <div className="savings-goal">
                <div className="savings-goal__input-container">
                    <label htmlFor="name">Name</label>
                    <InputText
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${(submitError && !value) ? 'p-invalid' : ''}`}
                    />

                </div>
                <div className="savings-goal__input-container">
                    <label htmlFor='note'>Note</label>
                    <InputTextarea
                        id="note"
                        autoResize
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={5}
                        cols={30}
                        required={false}
                        className={`${(submitError && !value) ? 'p-invalid' : ''}`}
                    />
                </div>
                <div className="savings-goal__input-container">
                    <label htmlFor="transfer-value">Value</label>
                    <InputNumber
                        id={"transfer-value"}
                        mode="currency"
                        currency={user.currency}
                        inputId="currency-pl"
                        value={value}
                        onChange={(e) => {
                            if (e.value) {
                                setValue(e.value)
                            }
                        }}
                        className={`${(submitError && !value) ? 'p-invalid' : ''}`}
                    />
                </div>
                <div className="savings-goal__input-container">
                    <label htmlFor="start-date">Start date</label>

                    <Calendar value={startDate} onChange={(e) => setStartDate(e.value as Date)}
                              className={`${submitError ? 'p-invalid' : ''}`} minDate={now}
                              dateFormat={'dd/mm/yy'}></Calendar>
                </div>
                <div className="savings-goal__input-container">
                    <label htmlFor="transfer-value">End date</label>
                    <Calendar value={endDate} onChange={(e) => setEndDate(e.value as Date)}
                              className={`${submitError ? 'p-invalid' : ''}`}
                              minDate={startDate ? startDate : now} dateFormat={'dd/mm/yy'}></Calendar>
                </div>
                <Button onClick={handleSubmit} style={{justifyContent: 'center'}}>Create</Button>
            </div>
        </Dialog>
    );
}

export default CreateSavingsGoalModal;