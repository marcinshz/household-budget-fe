import { useEffect, useState } from 'react';
import './navbar.scss';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { CreateCategoryDto, User } from '../../../../types';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { createCategory } from '../../../../DataService';

function Navbar(props: { user: User }) {
    const { user } = props;
    const [sidebar, setSidebar] = useState(false);
    const [currency, setCurrency] = useState("EUR");
    const [dialog, setDialog] = useState(false);
    const [type, setType] = useState("")
    const [name, setName] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem("currency", currency)
    }, [currency])
    useEffect(() => {
        const currencyTmp = localStorage.getItem("currency");
        if (currencyTmp) setCurrency(currencyTmp);
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("password");
        localStorage.removeItem("username");
        localStorage.removeItem("access_token");
        navigate('/login')
    }

    const handleOpenDialog = (type: string) => {
        setType(type);
        setDialog(true);
    }

    const handleCreateCategory = async () => {
        if (!name) setError(true);
        else {
            await createCategory(new CreateCategoryDto(name, user.id, type)).then(() => {
                setDialog(false);
                setName("");
            })
        }
    }

    const handleChange = (name: string) => {
        setError(false);
        setName(name);
    }

    return (
        <div className="navbar">
            <h3>Your budget</h3>
            <div className="navbar__right-side">
                <Dropdown
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={["EUR", "USD", "GBP", "PLN"]}
                    style={{ width: '110px', height: '30px', display: 'flex', alignItems: 'center' }}
                />
                <Button
                    icon="pi pi-user"
                    rounded
                    text
                    raised
                    severity="info"
                    aria-label="User"
                    style={{ width: '35px', height: '35px', backgroundColor: 'white' }}
                    onClick={() => setSidebar(true)}
                />
            </div>
            <Sidebar
                visible={sidebar}
                onHide={() => { setSidebar(false) }}
                position='right'
                fullScreen={window.innerWidth < 768}
                style={{ minWidth: '400px' }}
            >
                <h2 className='sidebar__header'>Hello {user.username}!</h2>

                <div className="sidebar__buttons">
                    <Button label='Create Expense Categories' link size="large" onClick={() => handleOpenDialog("expense")} />
                    <Button label='Create Income Categories' link size="large" onClick={() => handleOpenDialog("income")} />
                    <Button label='Financial Tips' link size="large" />
                    <Button label='Sign out' link size="large" onClick={() => handleSignOut()} />
                </div>
                <Dialog header={`Add new ${type} category`} visible={dialog} style={{ width: '90vw', maxWidth: '960px' }} position='top' onHide={() => setDialog(false)}>
                    <div className="add-category">
                        <div className="add-category__category-name-container">
                            <label htmlFor="category-name">Category name</label>
                            <InputText id="category-name" onChange={(e) => handleChange(e.target.value)} className={`${error ? 'p-invalid' : ''}`} />
                        </div>
                        <Button onClick={handleCreateCategory} style={{ justifyContent: 'center' }}>Add category</Button>
                    </div>
                </Dialog>
            </Sidebar>
        </div>
    )
}

export default Navbar