import React from 'react';
import './LoginSignup.css';
import emailIcon from '../Assets/email.png';
import passwordIcon from '../Assets/lock.png';

const LoginSignup = () => {

    const [action,setAction] = React.useState("Sign Up");
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    
    return (
        <div className= "container">
            <div className= "header"> 
                <div className = "text">{action}</div>
                <div className = {`underline ${action === 'Login' ? 'login' : 'signup'}`}></div>
            </div>
            
            <div className = "inputs">
                <div className = "input">
                    <img src={emailIcon} alt="email icon" />
                    <input
                        type="email"
                        placeholder="Student Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className = "input">
                    <img src={passwordIcon} alt="password icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {action === 'Sign Up' && (
                    <div className = "input">
                        <img src={passwordIcon} alt="confirm password icon" />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}

                {action === 'Sign Up' && password && confirmPassword && password !== confirmPassword && (
                    <div style={{color: 'red', paddingLeft: '62px'}}>Passwords do not match</div>
                )}
            </div>
            
            <div className = "forgot-password">Forgot Password? <span>Click Here!</span></div>
            
            <div className = "submit-containter">
                <button
                    type="button"
                    className={action === 'Login' ? 'submit gray' : 'submit'}
                    onClick={() => setAction('Sign Up')}
                >
                    Sign Up
                </button>

                <button
                    type="button"
                    className={action === 'Sign Up' ? 'submit gray' : 'submit'}
                    onClick={() => setAction('Login')}
                >
                    Login
                </button>
            </div>


        </div>
    );
}

export default LoginSignup;