export class GameDataManager{

    setValueShipsOnField(shipsOnField){

        let gameData = this.getGameData();

        gameData.playerField.shipsOnField = shipsOnField;

        this.setGameData(gameData);
    }

    setShipDeckPosition(pointsToPlant, shipNumber){

        let gameData = this.getGameData();

        for (let i = 0; i < pointsToPlant.length; i++){

            gameData.playerFleet.ships[shipNumber].decks[i].position = pointsToPlant[i];
        }

        this.setGameData(gameData);
    }

    setIsPlayerTurn(isPlayerTurn){

        let gameData = this.getGameData();

        gameData.isPlayerTurn = isPlayerTurn;

        this.setGameData(gameData);

    }

    shootDeck(shipId) {

        let gameData = this.getGameData();
        let fleet;

        if (gameData.isPlayerTurn){

            fleet = gameData.computerFleet;
        }
        else{
            fleet = gameData.playerFleet;
        }

        fleet.ships[shipId].hitsNumber = fleet.ships[shipId].hitsNumber + 1;

        if (fleet.ships[shipId].hitsNumber === fleet.ships[shipId].decks.length) {
            fleet.ships[shipId].isAlive = false;
        }

        this.setGameData(gameData);
    }

    shootSquare(squareNumber){

        let gameData = this.getGameData();

        gameData.playerField.squares[squareNumber].isClicked = true;

        this.setGameData(gameData);

    }

    resetShipsOnFleet() {

        let gameData = this.getGameData();
        let playerShips = gameData.playerFleet.ships;

        for (let i = 0; i < playerShips.length; i++) {

            let ship = playerShips[i];

            for (let j = 0; j < ship.decks.length; j++) {
                ship.decks[j].position = -1;
            }
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