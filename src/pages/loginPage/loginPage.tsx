import { useEffect, useState } from 'react';
import './loginPage.scss';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { UserAuthenticatedDto, UserCredentialsDto } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createAccountThunk, signInThunk } from '../../redux/thunks';
import { AppDispatch } from '../../redux/store';

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (localStorage.getItem('id')) navigate('/');
    }, [])

    const handleSubmit = async () => {
        let user_authenticated: UserAuthenticatedDto;
        if (register) {
            user_authenticated = await dispatch(createAccountThunk(new UserCredentialsDto(username, password))).then((value: any) => {
                return value.payload;
            });
        }
        else {
            user_authenticated = await dispatch(signInThunk(new UserCredentialsDto(username, password))).then((value: any) => {
                return value.payload;
            });
        }
        if (user_authenticated.access_token) {
            localStorage.setItem("username", user_authenticated.user.username);
            localStorage.setItem("id", user_authenticated.user.id);
            localStorage.setItem("password", user_authenticated.user.password);
            localStorage.setItem("access_token", user_authenticated.access_token);
            navigate('/');
        }
    }

    return (
        <div className="login-page">
            <div className="login-page__form-container">
                <h3 className='login-page__form-container__header'>{register ? "Create an account" : "Sign in"}</h3>

                <div className="login-page__form-container__username-container">
                    <label htmlFor='username'>Username</label>
                    <InputText id="username" onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="login-page__form-container__password-container">
                    <label htmlFor='password'>Password</label>
                    <Password id='password' feedback={register} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <Button label="Submit" onClick={handleSubmit} />
                <Button label={register ? "Already have an account?" : "Create an account"} link onClick={() => setRegister(!register)} />
            </div>
        </div>
    )
}
export default LoginPage
