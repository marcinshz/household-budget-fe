import {CreateLimitDto, ModalProps} from "../../../../types.ts";
import './CreateLimitModal.scss';
import {Dialog} from "primereact/dialog";
import {Dropdown} from "primereact/dropdown";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {useState} from "react";
import {Calendar} from "primereact/calendar";
import {createLimitThunk} from "../../../../redux/thunks.ts";

function CreateLimitModal({visible, setVisible}: ModalProps) {
    const {user, categories} = useSelector((state: RootState) => {
        return {user: state.user, categories: state.categories};
    })
    const [categoryId, setCategoryId] = useState("");
    const [submitError, setSubmitError] = useState(false);
    const [value, setValue] = useState(0);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const now = new Date();
    const dispatch = useDispatch<AppDispatch>();

    const handleSubmit = () => {
        if (categoryId && value && startDate && endDate) {
            dispatch(createLimitThunk(new CreateLimitDto(startDate, endDate, user.id, value, categoryId))).then(() => {
                setVisible(false);
            })
        } else {
            setSubmitError(true);
        }
    }

    return (
        <Dialog header="Create expense limit" visible={visible} style={{width: '90vw', maxWidth: '600px'}}
                onHide={() => setVisible(false)}>
            <div className="expense-limit">
                <div className="expense-limit__input-container">
                    <label htmlFor="category">Expense category</label>
                    <Dropdown
                        id="category"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.value)}
                        options={categories.expenses.filter((category) => {
                            return category.name !== "Internal Transfer"
                        })}
                        optionLabel={'name'}
                        optionValue={'id'}
                        className={`${(submitError && !categoryId) ? 'p-invalid' : ''}`}
                    />
                </div>
                <div className="expense-limit__input-container">
                    <label htmlFor="transfer-value">Value</label>
                    <InputNumber
                        id={"transfer-value"}
                        mode="currency"
                        currency="PLN"
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
                <div className="expense-limit__input-container">
                    <label htmlFor="start-date">Start date</label>

                    <Calendar value={startDate} onChange={(e) => setStartDate(e.value as Date)}
                              className={`${submitError ? 'p-invalid' : ''}`} minDate={now}
                              dateFormat={'dd/mm/yy'}></Calendar>
                </div>
                <div className="expense-limit__input-container">
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

export default CreateLimitModal;