export class GameDataManager{

    setValueShipsOnField(shipsOnField){

        let gameData = this.getGameData();

        gameData.playerField.shipsOnField = shipsOnField;

        this.setGameData(gameData);
    }

    setShipDeckPosition(pointsToPlant, shipNumber){

        let gameData = this.setGameData();

        for (let i = 0; i < pointsToPlant.length; i++){

            gameData.playerFleet.ships[shipNumber].decks[i].position = pointsToPlant[i];
        }

        this.setGameData(gameData);
    }

    shootDeck(shipId) {

        let gameData = this.getGameData();

        gameData.computerFleet.ships[shipId].hitsNumber = gameData.computerFleet.ships[shipId].hitsNumber + 1;

        if (gameData.computerFleet.ships[shipId].hitsNumber === gameData.computerFleet.ships[shipId].decks.length) {
            gameData.computerFleet.ships[shipId].isAlive = false;
        }

        this.setGameData(gameData);
    }

    getGameData(){

        return JSON.parse(sessionStorage.getItem('gameData'));

    }

    setGameData(gameData){

        sessionStorage.setItem('gameData', JSON.stringify(gameData));

    }

}