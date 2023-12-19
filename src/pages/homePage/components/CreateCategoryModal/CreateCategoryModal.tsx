import './CreateCategoryModal.scss';
import {CreateCategoryDto, TransactionType} from "../../../../types.ts";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "primereact/button";
import {createCategoryThunk} from "../../../../redux/thunks.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {useState} from "react";
import {expenseCategoryIcons} from "./categoryIcons.tsx";

type CreateCategoryModalProps = {
    type: TransactionType;
    visible: boolean;
    setVisible: Function;
}

function CreateCategoryModal({type, visible, setVisible}: CreateCategoryModalProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [iconName, setIconName] = useState("");
    const dispatch = useDispatch<AppDispatch>();
    const {user} = useSelector((state: RootState) => state);

    const handleCreateCategory = async () => {
        //TODO VALIDATION
        const category = new CreateCategoryDto(name, user.id, type);
        await dispatch(createCategoryThunk(category)).then(() => {
            setVisible(false);
        });
    }

    const handleChange = (name: string) => {
        setError(false);
        setName(name);
    }

    return (
        <Dialog header={`Add new ${type} category`} visible={visible} style={{width: '90vw', maxWidth: '560px'}}
                position='top' onHide={() => setVisible(false)}>
            <div className="add-category">
                <div className="add-category__category-name-container">
                    <label htmlFor="category-name">Category name</label>
                    <InputText id="category-name" onChange={(e) => handleChange(e.target.value)}
                               className={`${error ? 'p-invalid' : ''}`}/>
                </div>
                <div className="add-category__icon-picker">
                    <span className="add-category__icon-picker__header">Pick an icon</span>
                    <div className="add-category__icon-picker__icons">
                        {type === TransactionType.EXPENSE ?
                            <>{expenseCategoryIcons.map((item) => (
                                <label className="add-category__icon-picker__icons__item" htmlFor={item.name}>
                                    <input type="radio" name="icon" value={item.name} key={item.name} id={item.name}
                                           onChange={(e) => setIconName(item.name)}/>
                                    <FontAwesomeIcon icon={item.icon} size={"xl"} fixedWidth/>
                                </label>

                            ))}</>
                            :
                            <></>
                        }
                    </div>
                </div>
                <Button onClick={handleCreateCategory} style={{justifyContent: 'center'}}>Add category</Button>
            </div>
        </Dialog>
    );
}

export default CreateCategoryModal;