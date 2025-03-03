import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import Swal from 'sweetalert2';

export default function MatchingGame() {
    const { matchingGameId } = useParams();
    const navigate = useNavigate();
    const [matchingGame, setMatchingGame] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedWord, setSelectedWord] = useState('');
    const [selectedMeaning, setSelectedMeaning] = useState('');
    const [answerSubmitted, setAnswerSubmitted] = useState(new Map());
    const [isCorrect, setIsCorrect] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [gameLost, setGameLost] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [remainingAttempts, setRemainingAttempts] = useState(6);
    const timerRef = useRef(null);
    const wordRefs = useRef({});
    const meaningRefs = useRef({});

    async function fetchMatchingGame() {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/api/matchingGame/${matchingGameId}`, {
                method: 'GET',
                headers: {
                    Authorization: `${token}`,
                },
            });
            const data = await response.json();

            switch (response.status) {
                case 200:
                    setMatchingGame(data);
                    setSelectedWord('');
                    setSelectedMeaning('');
                    setAnswerSubmitted(new Map());
                    setIsCorrect(false);
                    setGameLost(false);
                    setGameWon(false);
                    setTimeLeft(data.duration);
                    setRemainingAttempts(6);
                    break;
                case 401:
                case 404:
                    setErrorMessage(data.message);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setErrorMessage('Error al cargar el juego de Relacionar Palabras');
        }
    }

    async function fetchDeck() {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${API_URL}/api/deck/${matchingGame?.deck}`, {
                headers: {
                    Authorization: ` ${token}`,
                },
            });
            switch (response.status) {
                case 200:
                    setDeckName(response.data.name.replace(/(-[a-z0-9]{6,})+$/, ''));
                    break;
                case 401:
                case 404:
                    setErrorMessage(response.data.message);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setErrorMessage('Error al cargar el mazo');
        }
    }

    useEffect(() => {
        fetchMatchingGame();
    }, [matchingGameId]);

    useEffect(() => {
        if (matchingGame) {
            fetchDeck();
        }
    }, [matchingGame]);

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && matchingGame) {
            if (matchingGame.game.currentGameCount >= matchingGame.game.totalGames) {
                handleForceCompleteFinalGame();
            } else {
                const correctAnswersText = Object.entries(matchingGame.correctAnswer)
                    .map(([word, meaning]) => `${word}: ${meaning}`)
                    .join(', ');

                setTimeout(() => {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Tiempo agotado',
                        text: `Has perdido esta partida. La palabra era: ${correctAnswersText}`,
                    }).then(() => {
                        handleForceCompleteFirstGame();
                    });
                }, 500);
            }
        }
        return () => clearTimeout(timerRef.current);
    }, [timeLeft, matchingGame]);

    useEffect(() => {
        if (gameLost) {
            const correctAnswersText = Object.entries(matchingGame.correctAnswer)
                .map(([word, meaning]) => `${word}: ${meaning}`)
                .join(', ');

            setTimeout(() => {
                Swal.fire({
                    icon: 'error',
                    title: '¡Has perdido!',
                    text: `La respuesta correcta era: ${correctAnswersText}`,
                }).then(() => {
                    setGameLost(true);
                    clearTimeout(timerRef.current);
                });
            }, 4000);
        }
    }, [gameLost, matchingGame]);

    useEffect(() => {
        if (gameWon) {
            const correctAnswersText = Object.entries(matchingGame.correctAnswer)
                .map(([word, meaning]) => `${word}: ${meaning}`)
                .join(', ');

            setTimeout(() => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Correcto!',
                    text: `La respuesta era: ${correctAnswersText}`,
                }).then(() => {
                    setGameWon(true);
                    clearTimeout(timerRef.current);
                    handleNextGame();
                });
            }, 500);
        }
    }, [gameWon, matchingGame]);

    async function handleNextGame(countAsCompleted = true) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(
                `${API_URL}/api/currentMatchingGame/${matchingGameId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify({ selectedAnswer: Object.fromEntries(answerSubmitted), countAsCompleted }),
            });
            const data = await response.json();
            switch (response.status) {
                case 201:
                    const newMatchingGameId = data.matchingGameId;
                    navigate(`/matchingGame/${newMatchingGameId}`);
                    break;
                case 200:
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Juego Completado',
                            text: data.message,
                        }).then(() => {
                            navigate('/lobby');
                        });
                    }, 1500);
                    break;
                case 401:
                case 404:
                case 400:
                    setErrorMessage(data.error);
                    break;
                default:
                    setErrorMessage('Error al pasar a la siguiente partida');
                    break;
            }
        } catch (error) {
            setErrorMessage('No hay suficientes cartas válidas para encajar en la siguiente partida. Por favor, añade más cartas al mazo para poder crear un nuevo juego.');
        }
    }

    async function handleForceCompleteFirstGame() {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${API_URL}/api/currentMatchingGame/${matchingGameId}`, { forceComplete: true, selectedAnswer: Object.fromEntries(answerSubmitted) }, {
                headers: {
                    Authorization: ` ${token}`,
                },
            });
            switch (response.status) {
                case 201:
                    const newMatchingGameId = response.data.matchingGameId;
                    navigate(`/matchingGame/${newMatchingGameId}`);
                    break;
                case 200:
                    if (response.data.nextGame) {
                        handleNextGame();
                    }
                    break;
                case 401:
                case 404:
                case 400:
                    setErrorMessage(response.data.message);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setErrorMessage('Error al forzar la finalización del juego');
        }
    }

    async function handleForceCompleteFinalGame() {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${API_URL}/api/currentMatchingGame/${matchingGameId}`, { forceComplete: true, selectedAnswer: Object.fromEntries(answerSubmitted) }, {
                headers: {
                    Authorization: ` ${token}`,
                },
            });
            switch (response.status) {
                case 200:
                    const correctAnswersText = Object.entries(matchingGame.correctAnswer)
                        .map(([word, meaning]) => `${word}: ${meaning}`)
                        .join(', ');

                    setTimeout(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Tiempo agotado',
                            text: `Has perdido esta partida. La imagen era: ${correctAnswersText} y el juego ha sido completado.`,
                        }).then(() => {
                            navigate('/lobby');
                        });
                    }, 500);
                    break;
                case 401:
                case 404:
                case 400:
                    setErrorMessage(response.data.message);
                    break;
                default:
                    break;
            }
        } catch (error) {
            setErrorMessage('Error al forzar la finalización del juego');
        }
    }

    useEffect(() => {
        if (matchingGame) {
            setSelectedWord('');
            setSelectedMeaning('');
            setAnswerSubmitted(new Map());
            setIsCorrect(false);
            setGameLost(false);
            setGameWon(false);
            setRemainingAttempts(6);
        }
    }, [matchingGame]);

    const handleWordClick = (word) => {
        setSelectedWord(word);
    };

    const handleMeaningClick = (meaning) => {
        if (selectedWord) {
            setSelectedMeaning(meaning);
        }
    };

    const handleSubmit = () => {
        if (selectedWord && selectedMeaning) {
            const newAnswerSubmitted = new Map(answerSubmitted);
            newAnswerSubmitted.set(selectedWord, selectedMeaning);
            setAnswerSubmitted(newAnswerSubmitted);

            if (matchingGame.correctAnswer[selectedWord] === selectedMeaning) {
                setIsCorrect(true);
                setSelectedWord('');
                setSelectedMeaning('');
                const allCorrect = newAnswerSubmitted.size === matchingGame.words.length &&
                    Array.from(newAnswerSubmitted.entries()).every(
                        ([word, meaning]) => matchingGame.correctAnswer[word] === meaning
                    );

                if (allCorrect) {
                    setGameWon(true);

                    setTimeout(() => {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Correcto!',
                            text: 'Has completado todas las palabras correctamente.',
                        });
                    }, 1500);
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Correcto!',
                        text: 'La respuesta es correcta. Continúa con las siguientes palabras.',
                    });
                }
            } else {
                setIsCorrect(false);
                newAnswerSubmitted.delete(selectedWord);
                setAnswerSubmitted(newAnswerSubmitted);
                setSelectedMeaning('');
                setRemainingAttempts(remainingAttempts - 1);
                setTimeout(() => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Respuesta incorrecta',
                        text: 'Intenta de nuevo.',
                    });
                }, 500);

                if (remainingAttempts - 1 === 0) {
                    setTimeout(() => {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Has perdido!',
                            text: `Has excedido el número máximo de intentos.`,
                        }).then(() => {
                            setGameLost(true);
                            clearTimeout(timerRef.current);
                        });
                    }, 4000);
                }
            }
        }
    };

    const calculateMarginTop = () => {
        if (!matchingGame || !matchingGame.words) return '4rem';
        const wordCount = matchingGame.words.length;
        if (wordCount === 2) return '4rem';
        if (wordCount === 3) return '6rem';
        if (wordCount === 4) return '8rem';
        return '4rem';
    };

    const renderWords = () => {
        if (!matchingGame || !matchingGame.words) return null;

        return (
            <div className="words-container flex flex-col space-y-2" style={{ marginTop: calculateMarginTop() }}>
                {matchingGame.words.map((word, index) => (
                    <button
                        key={index}
                        ref={(el) => (wordRefs.current[word] = el)}
                        className={`word-button p-2 border rounded-lg ${selectedWord === word ? 'bg-gray-300' : ''} ${answerSubmitted.has(word) && answerSubmitted.get(word) === matchingGame.correctAnswer[word] ? 'bg-green-300' : ''}`}
                        onClick={() => handleWordClick(word)}
                        disabled={answerSubmitted.has(word) && answerSubmitted.get(word) === matchingGame.correctAnswer[word]}
                        style={{ width: '200px', height: '50px' }}
                    >
                        {word}
                    </button>
                ))}
            </div>
        );
    };

    const renderMeanings = () => {
        if (!matchingGame || !matchingGame.options) return null;

        return (
            <div className="meanings-container flex flex-col space-y-2 ml-52">
                {matchingGame.options.map((meaning, index) => (
                    <button
                        key={index}
                        ref={(el) => (meaningRefs.current[meaning] = el)}
                        className={`meaning-button p-2 border rounded-lg ${selectedMeaning === meaning ? 'bg-gray-300' : ''} ${Array.from(answerSubmitted.values()).includes(meaning) && Array.from(answerSubmitted.entries()).some(([word, submittedMeaning]) => matchingGame.correctAnswer[word] === submittedMeaning) ? 'bg-green-300' : ''}`}
                        onClick={() => handleMeaningClick(meaning)}
                        disabled={Array.from(answerSubmitted.values()).includes(meaning) && Array.from(answerSubmitted.entries()).some(([word, submittedMeaning]) => matchingGame.correctAnswer[word] === submittedMeaning)}
                        style={{ width: '200px', height: '50px' }}
                    >
                        {meaning}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6 text-center">Juego de Relacionar Palabras</h1>
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
                Mazo: {deckName}
            </h2>
            <h3 className="text-xl font-semibold mb-6 text-center text-red-600">
                Tiempo restante: {timeLeft} segundos
            </h3>
            <h3 className="text-xl font-semibold mb-6 text-center text-green-600">
                Partida: {matchingGame?.game.currentGameCount}/{matchingGame?.game.totalGames}
            </h3>
            <h3 className="text-xl font-semibold mb-6 text-center text-yellow-600">
                Intentos restantes: {remainingAttempts}
            </h3>
            {errorMessage ? (
                <p className="text-red-600">{errorMessage}</p>
            ) : !matchingGame ? (
                <p>Cargando...</p>
            ) : (
                <>
                    <div className="relative flex" style={{ marginLeft: '20px' }}>
                        <div>
                            {renderWords()}
                        </div>
                        <div>
                            {renderMeanings()}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="bg-gradient-to-r from-blue-200 to-blue-400 text-black px-6 py-3 rounded-xl shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-blue-300 focus:outline-none mt-4 ml-12"
                            onClick={handleSubmit}
                            disabled={!selectedWord || !selectedMeaning}
                        >
                            Enviar Respuesta
                        </button>
                        {gameLost || gameWon ? (
                            matchingGame.game.currentGameCount < matchingGame.game.totalGames ? (
                                <button onClick={() => handleNextGame(!gameLost)} className="hidden">Siguiente Juego</button>
                            ) : (
                                navigate('/lobby')
                            )
                        ) : null}
                    </div>

                    <div className="flex space-x-4 mt-4 mb-8 ml-16">
                        <button
                            className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-48 duration-300"
                            onClick={() => navigate('/lobby')}
                            style={{ width: '250px' }}
                        >
                            Volver al Catálogo de Juegos
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg shadow-lg bg-gradient-to-r from-gray-200 to-gray-400 text-black transform transition-transform hover:scale-105 hover:shadow-xl active:scale-95 focus:ring focus:ring-gray-300 focus:outline-none w-48 duration-300"
                            onClick={() => navigate(`/selectDeckGame/MatchingGame/${matchingGame.user}`)}
                            style={{ width: '250px' }}
                        >
                            Cambiar de Mazo
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}