import React, { useState } from 'react'
import { useAuthContext } from '../context/authContext'
import { API_URL } from '../config'
import axios from 'axios'
import '../styles/FondoCartas.css';

export default function UserDetail() {
    const { authenticated } = useAuthContext()
    const [user, setUser] = useState({})

    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (authenticated) {

                    const currentUserId = localStorage.getItem('userId')
                    const response = await axios.get(`${API_URL}/api/users`)
                    const user = response.data.find((user) => user._id === currentUserId)
                    setUser(user)
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
            }
        }
        fetchUserData()
    }, [authenticated])


    const userId = localStorage.getItem('userId')
    React.useEffect(() => {

    }, [userId])
    console.log('User:', user)
    return (
        <div className='user-detail'>
            <h2>User Details</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Games Completed By Type:</strong> {JSON.stringify(user.gamesCompletedByType)}</p>
            <p><strong>Cards:</strong> {user.cards && user.cards.length}</p>
            <p><strong>Desks:</strong> {user.desks && user.desks.length}</p>
            <p><strong>Games:</strong> {user.games && user.games.length}</p>
        </div>
    )
}