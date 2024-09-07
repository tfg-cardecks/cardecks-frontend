import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/Logo.jpg";
import { useAuthContext } from '../context/authContext';
import Swal from 'sweetalert2';

export default function Header() {
    const { authenticated, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        Swal.fire({
            icon: 'success',
            title: 'Logged out',
            text: 'You have been logged out successfully.',
            showConfirmButton: true,
            confirmButtonColor: 'black',
            background: 'gray',
            color: 'white',
        }).then(() => {
            navigate('/');
        });
    };

    return (
        <header className="text-gray-600 body-font border-b border-gray-300">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link
                    to={"/"}
                    className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
                >
                    <img
                        src={Logo}
                        alt="Logo"
                        className="w-20 h-20 rounded-full"
                    />
                    <span className="ml-3 text-xl">Cardecks</span>
                </Link>
                <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
                    <Link to={"/cards"} className="mr-5 hover:text-gray-900">
                        Cards
                    </Link>
                    <Link to={"/decks"} className="mr-5 hover:text-gray-900">
                        Decks
                    </Link>
                    <Link to={"/games"} className="mr-5 hover:text-gray-900">
                        Games
                    </Link>
                    <Link to={"/user/details"} className="mr-5 hover:text-gray-900">
                        User
                    </Link>
                </nav>
                <div className="md:ml-auto flex items-center">
                    {!authenticated && (
                        <>
                            <Link to={"/register"} className="mr-5 hover:text-gray-900">
                                Register
                            </Link>
                            <Link to={"/login"} className="mr-5 hover:text-gray-900">
                                Login
                            </Link>
                        </>
                    )}
                    {authenticated && (
                        <button onClick={handleLogout} className="mr-5 hover:text-gray-900">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}