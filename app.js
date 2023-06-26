const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
app.use(express.json());
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

//db initialization..
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("server Running in port: 3001");
    });
  } catch (e) {
    console.log(e);
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//api1 get players from cricket_team table
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    select  player_id as playerId, player_name as playerName, jersey_number as jerseyNumber, role
    from cricket_team;`;
  const dbResponse = await db.all(getPlayersQuery);
  response.send(dbResponse);
});

//api2 post into cricket_team db
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
    insert into cricket_team
    (player_name, jersey_number, role)
    values (
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    );
    `;
  const dbResponse = await db.run(addPlayerQuery);
  console.log(dbResponse);
  response.send("Player Added to Team");
});

//api3 get player by id ^
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `
    select player_id as playerId, player_name as playerName, jersey_number as jerseyNumber, role
    from cricket_team
    where player_id = ${playerId};`;
  const dbResponse = await db.all(getPlayersQuery);
  response.send(dbResponse[0]);
});

//api4 updatePlayer call ***
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayerQuery = `
    UPDATE cricket_team
    set
    player_name  = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    where player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//api5 delete
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    delete from cricket_team
    where player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
