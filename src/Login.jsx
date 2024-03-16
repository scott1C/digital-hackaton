import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';


export function Login() {
    const navigate = useNavigate()

    return (
        <div className={styles.layout}>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    const token = credentialResponse.credential
                    const decodedHeader = jwtDecode(token);
                    const name = decodedHeader.name
                    navigate('/')
                    localStorage.setItem('userToken', token)
                    localStorage.setItem('userName', name)
                }}
                onError={() => {
                    alert('An error occurred, try again!')
                }}
            />
        </div>
    )
}