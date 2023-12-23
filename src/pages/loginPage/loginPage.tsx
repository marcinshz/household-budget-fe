import {useState} from 'react';
import './loginPage.scss';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {UserAuthenticatedDto, UserCredentialsDto} from '../../types';
import {useDispatch} from 'react-redux';
import {createAccountThunk, signInThunk} from '../../redux/thunks';
import {AppDispatch} from '../../redux/store';
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        let user_authenticated: UserAuthenticatedDto;
        if (register) {
            user_authenticated = await dispatch(createAccountThunk(new UserCredentialsDto(username, password))).then((value: any) => {
                return value.payload;
            });
        } else {
            user_authenticated = await dispatch(signInThunk(new UserCredentialsDto(username, password))).then((value: any) => {
                return value.payload;
            });
        }
        if (user_authenticated.access_token) {
            localStorage.setItem("access_token", user_authenticated.access_token);
            localStorage.setItem("id", user_authenticated.user.id);
            localStorage.setItem("username", user_authenticated.user.username);
            localStorage.setItem("CURRENCY", "EUR");
            navigate('/');
        } else setError(true);
    }

    const handleChange = (text: string, type: boolean) => {
        setError(false);
        if (type) setUsername(text);
        else setPassword(text);
    }

    return (
        <div className="login-page">
            <div className="login-page__form-container">
                <h3 className='login-page__form-container__header'>{register ? "Create an account" : "Sign in"}</h3>

                <div className="login-page__form-container__username-container">
                    <label htmlFor='username'>Username</label>
                    <InputText id="username" onChange={(e) => handleChange(e.target.value, true)}
                               className={`${error ? 'p-invalid' : ''}`}/>
                </div>

                <div className="login-page__form-container__password-container">
                    <label htmlFor='password'>Password</label>
                    <Password id='password' feedback={register} onChange={(e) => handleChange(e.target.value, false)}
                              className={`${error ? 'p-invalid' : ''}`}/>
                </div>

                <Button label="Submit" onClick={handleSubmit}/>
                <Button label={register ? "Already have an account?" : "Create an account"} link
                        onClick={() => setRegister(!register)}/>
            </div>
        </div>
    )
}

export default LoginPage
