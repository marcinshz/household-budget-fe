import {useEffect, useState} from 'react';
import './Navbar.scss';
import {Sidebar} from 'primereact/sidebar';
import {Button} from 'primereact/button';
import {TransactionType, User} from '../../../../types';
import {Dropdown} from 'primereact/dropdown';
import {useNavigate} from 'react-router-dom';
import CreateCategoryModal from "../CreateCategoryModal/CreateCategoryModal.tsx";

function Navbar(props: { user: User }) {
    const {user} = props;
    const [sidebar, setSidebar] = useState(false);
    const [currency, setCurrency] = useState("EUR");
    const [dialog, setDialog] = useState(false);
    const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
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
        localStorage.removeItem("username");
        localStorage.removeItem("access_token");
        navigate('/login')
    }

    const handleOpenDialog = (type: TransactionType) => {
        setType(type);
        setDialog(true);
    }


    return (
        <div className="navbar">
            <h3>Your budget</h3>
            <div className="navbar__right-side">
                <Dropdown
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    options={["EUR", "USD", "GBP", "PLN"]}
                    style={{width: '110px', height: '30px', display: 'flex', alignItems: 'center'}}
                />
                <Button
                    icon="pi pi-user"
                    rounded
                    text
                    raised
                    severity="info"
                    aria-label="User"
                    style={{width: '35px', height: '35px', backgroundColor: 'white'}}
                    onClick={() => setSidebar(true)}
                />
            </div>
            <Sidebar
                visible={sidebar}
                onHide={() => {
                    setSidebar(false)
                }}
                position='right'
                fullScreen={window.innerWidth < 768}
                style={{minWidth: '400px'}}
            >
                <h2 className='sidebar__header'>Hello {user.username}!</h2>

                <div className="sidebar__buttons">
                    <Button label='Create Expense Categories' link size="large"
                            onClick={() => handleOpenDialog(TransactionType.EXPENSE)}/>
                    <Button label='Create Income Categories' link size="large"
                            onClick={() => handleOpenDialog(TransactionType.INCOME)}/>
                    <Button label='Financial Tips' link size="large"/>
                    <Button label='Sign out' link size="large" onClick={() => handleSignOut()}/>
                </div>

                <CreateCategoryModal type={type} visible={dialog} setVisible={setDialog}/>
            </Sidebar>
        </div>
    )
}

export default Navbar