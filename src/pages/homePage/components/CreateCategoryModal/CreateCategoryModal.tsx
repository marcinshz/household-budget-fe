import './CreateCategoryModal.scss';
import {CreateCategoryDto, TransactionType} from "../../../../types.ts";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {createCategoryThunk} from "../../../../redux/thunks.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../redux/store.ts";
import {useState} from "react";

type CreateCategoryModalProps = {
    type: TransactionType;
    visible: boolean;
    setVisible: Function;
}

function CreateCategoryModal({type, visible, setVisible}: CreateCategoryModalProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const {user} = useSelector((state: RootState) => state);

    const handleCreateCategory = async () => {
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
                <Button onClick={handleCreateCategory} style={{justifyContent: 'center'}}>Add category</Button>
            </div>
        </Dialog>
    );
}

export default CreateCategoryModal;