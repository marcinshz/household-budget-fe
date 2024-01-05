import {useEffect, useState} from 'react';
import './Navbar.scss';
import {Sidebar} from 'primereact/sidebar';
import {Button} from 'primereact/button';
import {TransactionType, UpdateCurrencyDto} from '../../../../types';
import {Dropdown, DropdownChangeEvent} from 'primereact/dropdown';
import {useNavigate} from 'react-router-dom';
import CreateCategoryModal from "../CreateCategoryModal/CreateCategoryModal.tsx";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {updateCurrency} from "../../../../DataService.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../../redux/store.ts";

function Navbar() {
    const {user} = useSelector((state: RootState) => {
        return {user: state.user};
    });
    const [sidebar, setSidebar] = useState(false);
    const [currency, setCurrency] = useState(user.currency);
    const [dialog, setDialog] = useState(false);
    const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
    const navigate = useNavigate();
    useEffect(() => {
        if (currency) localStorage.setItem("currency", currency);
    }, [currency])
    useEffect(() => {
        const currencyTmp = localStorage.getItem("currency");
        if (currencyTmp) setCurrency(currencyTmp);
    }, [])

    const handleSignOut = () => {
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("access_token");
        localStorage.removeItem("currency");
        navigate('/login')
    }

    const handleOpenDialog = (type: TransactionType) => {
        setType(type);
        setDialog(true);
    }

    const handleCurrencyChange = async (e: DropdownChangeEvent) => {
        setCurrency(e.target.value);
        const tmp = await updateCurrency(new UpdateCurrencyDto(e.target.value, user.id));
        localStorage.setItem("currency", tmp);
    }

    return (
        <div className="navbar">
            <Button style={{padding: 0}} onClick={() => navigate('/')}>
                <h3>Your budget</h3>
            </Button>
            <div className="navbar__right-side">
                <Dropdown
                    value={currency}
                    onChange={handleCurrencyChange}
                    options={["EUR", "USD", "GBP", "PLN"]}
                    style={{width: '110px', height: '30px', display: 'flex', alignItems: 'center'}}
                />
                <Button
                    rounded
                    text
                    raised
                    severity="info"
                    aria-label="User"
                    style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'white',
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => setSidebar(true)}
                >
                    <FontAwesomeIcon icon={faUser} size={"sm"} fixedWidth/>
                </Button>
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
                    <Button label='Sign out' link size="large" onClick={() => handleSignOut()}/>
                </div>

                <CreateCategoryModal type={type} visible={dialog} setVisible={setDialog}/>
            </Sidebar>
        </div>
    )
}

export default Navbar