import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/authContext';
import axios from 'axios';
import { API_URL } from '../config';
import AnimatedCards from '../components/AnimatedCards';

export default function UserDetail() {
  const { authenticated } = useAuthContext();
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (authenticated) {
          const currentUserId = localStorage.getItem('userId');
          const response = await axios.get(`${API_URL}/api/users`);
          const userData = response.data.find((user) => user._id === currentUserId);
          switch (response.status) {
            case 200:
              setUser(userData);
              break;
            case 403:
            case 404:
              setErrors(userData);
              break;
            default:
              break;
          }
        } else {
          setErrors({ message: 'No estás autenticado. Por favor, inicia sesión.' });
          }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [authenticated]);

  return (
    <div style={styles.container}>
      <AnimatedCards pageClass="home-page" animationClass="home-animation" />
      <div style={styles.card}>
        {errors.message && (
          <p className='text-blue-700'>{errors.message}</p>
        )}
        <h2 style={styles.title}>Detalles del Usuario</h2>
        <hr style={styles.divider} />
        <div style={styles.info}>
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Apellido:</strong> {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nombre de Usuario:</strong> {user.username}</p>
          <p><strong>Rol:</strong> {user.role}</p>
        </div>

        <h2 style={styles.title}>Estadísticas</h2>
        <hr style={styles.divider} />
        <div style={styles.stats}>
          <p><strong>Juegos Completados por Tipo:</strong></p>
          <ul>
            {user.gamesCompletedByType && Object.entries(user.gamesCompletedByType).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
          <p><strong>Total de Cartas:</strong> {user.cards && user.cards.length}</p>
          <p><strong>Total de Mazos:</strong> {user.desks && user.desks.length}</p>
          <p><strong>Total de Juegos:</strong> {user.games && user.games.length}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '80%',
    maxWidth: '800px',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px black',
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  divider: {
    border: 'none',
    height: '2px',
    backgroundColor: '#90EE90',
    marginBottom: '20px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '30px',
  },
  stats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statsList: {
    listStyleType: 'disc',
    marginLeft: '20px',
  },
};