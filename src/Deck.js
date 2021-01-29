import {useEffect, useState, useRef} from 'react';
import Card from './Card';
import axios from 'axios';

const Deck = () => {
    const [currCard, setCurrCard] = useState({value: "", suit: ""});
    const [deckId, setDeckId] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const timer = useRef(null);
    
    useEffect(() => {
        async function getDeckId() {
            const resp = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
            setDeckId(resp.data.deck_id); 
        }
        getDeckId();
    }, []);

    useEffect(() => {
        async function getCard() {
            try {
                const resp = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
                if(!resp.data.remaining) {
                    setIsDrawing(false);
                    alert("No cards remaining");
                }
                setCurrCard(resp.data.cards[0]);
            } catch (error) {
                console.log(error)
            }
        }

        if(isDrawing && !timer.current) {
            timer.current = setInterval(async() => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timer.current);
            timer.current = null;
        }
    }, [isDrawing, setIsDrawing, deckId]);

    const startAutoDraw = () => setIsDrawing(!isDrawing);

    return(
        <div>
            <button onClick={startAutoDraw}>Get Card</button>
            <Card value={currCard.value} suit={currCard.suit}/>
        </div>
    )
}

export default Deck;

//setInterval. remember to clear it we need to store it in an variable. 