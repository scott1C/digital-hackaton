import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import styles from './Navbar.module.scss';

const Navbar = () => {

    const [isAuthentificated, setIsAuthentificated] = useState(false)
    const [name, setName] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('userToken')
        const name = localStorage.getItem('userName')
        if (token && name) {
            setIsAuthentificated(true)
            setName(name)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userName')
        setIsAuthentificated(false)
        setName('')
    }

    return (
        <nav className={styles.layout}>
            <ul>
                <li>
                    {isAuthentificated ? (
                        <>
                            Welcome, {name}
                            <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
