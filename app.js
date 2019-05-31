// CS360 project#2 tutorial
// author: smhan@dbserver.kaist.ac.kr

var mysql = require('mysql'); // MySQL module on node.js

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'nba_young',
    password : 'cs360',
    database : 'nba_db',
});

connection.connect(); // Connection to MySQL

var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use('/', express.static(__dirname + '/public')); // you may put public js, css, html files if you want...
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var cheerio = require('cheerio');
var request = require('request');

// "node app.js" running on port 3000
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

// base url action: "http://localhost/" -> send "index.html" file.
app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});
app.get('/KakaoTalk_20181207_170736676.png', function (req, res) {
	res.sendFile(__dirname + "/KakaoTalk_20181207_170736676.png");
});
app.get('/NBA.png', function (req, res) {
	res.sendFile(__dirname + "/NBA.png");
});

async function insertAll(){
    let url_0 = "http://localhost:3000/insertSchedule";
    let url_1 = "http://localhost:3000/insertTeam";
    let url_2 = "http://localhost:3000/insertPlayer";
    let url_3 = "http://localhost:3000/insertGame";
    let url_4 = "http://localhost:3000/insertTeamStat";
    await request(url_2, function(error, response, body){
    });
    await request(url_1, function(error, response, body){
    });
    await request(url_0, function(error, response, body){
    });
    await request(url_3, function(error, response, body){
    });
    await request(url_4, function(error, response, body){
    });
}

function insertPlayerStat()
{
    let url_3 = "http://localhost:3000/insertPlayerStat";
    request(url_3, function(error, response, body){
    });
}

app.get('/insertAll_1', function (req, res, next) {
    insertAll();
    res.json('done_1');
});

app.get('/insertAll_2', function (req, res, next) {
    insertPlayerStat();
    res.json('done_2');
});

app.get('/updateAll', function (req, res, next) {
    let url_update_teamstat = "http://localhost:3000/updateTeamStat";
    let url_update_game = "http://localhost:3000/updateGame";
    let url_update_playerstat = "http://localhost:3000/updatePlayerStat";

    request(url_update_teamstat, function(error, response, body){
    });
    request(url_update_game, function(error, response, body){
    });
    request(url_update_playerstat, function(error, response, body){
    });
    res.json('update done');
});

// API : insertTeamStat
app.get('/insertTeamStat', function (req, res, next) {
    let url = "http://data.nba.net/data/10s/prod/v1/2018/team_stats_rankings.json";
    let url_2 = "http://data.nba.net/data/10s/prod/v1/20181202/standings_all.json";
    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);
        for(let i=0;i<jsonObject.league.standard.regularSeason.teams.length;i++)
        {
            if(jsonObject.league.standard.regularSeason.teams[i].min.avg === '-')
            {
                continue;
            }
            jsonArr.push(jsonObject.league.standard.regularSeason.teams[i])
        }
        jsonArr.sort(function(a,b){return parseInt(a.teamId,10)-parseInt(b.teamId,10)});

        request(url_2, function(err, respon, body_part)
        {
            let jsonArr_2 = [];
            let json_Object = JSON.parse(body_part);
            for(let i=0; i< json_Object.league.standard.teams.length; i++)
            {
                jsonArr_2.push(json_Object.league.standard.teams[i]);
            }
            jsonArr_2.sort(function(a,b){return parseInt(a.teamId,10)-parseInt(b.teamId,10)});

            for(let i=0;i<jsonArr_2.length;i++)
            {
                let jsonelem_1 = jsonArr[i];
                let jsonelem_2 = jsonArr_2[i];
                let game_played = parseInt(jsonelem_2.win,10) + parseInt(jsonelem_2.loss,10);
                queryString = 'INSERT INTO team_stats (team_id, GP, win, loss, winp, min, pts, fgp, tpp, ftp, oreb, dreb, reb, ast, tov, stl, blk, pf) VALUES ("'
                            + jsonelem_2.teamId + '",'
                            + game_played + ','
                            + parseInt(jsonelem_2.win,10) + ','
                            + parseInt(jsonelem_2.loss,10) + ','
                            + parseFloat(jsonelem_2.winPct) + ','
                            + parseFloat(jsonelem_1.min.avg) + ','
                            + parseFloat(jsonelem_1.ppg.avg) + ','
                            + parseFloat(jsonelem_1.fgp.avg) + ','
                            + parseFloat(jsonelem_1.tpp.avg) + ','
                            + parseFloat(jsonelem_1.ftp.avg) + ','
                            + parseFloat(jsonelem_1.orpg.avg) + ','
                            + parseFloat(jsonelem_1.drpg.avg) + ','
                            + parseFloat(jsonelem_1.trpg.avg) + ','
                            + parseFloat(jsonelem_1.apg.avg) + ','
                            + parseFloat(jsonelem_1.tpg.avg) + ','
                            + parseFloat(jsonelem_1.spg.avg) + ','
                            + parseFloat(jsonelem_1.bpg.avg) + ','
                            + parseFloat(jsonelem_1.pfpg.avg) + ');';
                // console.log(queryString);

                connection.query(queryString, function (err, rows) { // send query to MySQL
                    if (err) throw err;
                    // console.log(rows); // log to check MySQL insertion result
                });
            }
        });
    });
    res.json('success');
    console.log('insertTeamStat done');
});

// API : updateTeamStat
app.get('/updateTeamStat', function (req, res, next) {
    var time = new Date();
    var date = (time.getDate() < 10 ? '0' : '') + (time.getDate()).toString();
    var current_date = time.getFullYear()+(time.getMonth()+1).toString() + date;
    current_date = '20181208'
    let url = "http://data.nba.net/data/10s/prod/v1/2018/team_stats_rankings.json";
    let url_2 = "http://data.nba.net/data/10s/prod/v1/"+current_date+"/standings_all.json";

    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);
        for(let i=0;i<jsonObject.league.standard.regularSeason.teams.length;i++)
        {
            if(jsonObject.league.standard.regularSeason.teams[i].min.avg === '-')
            {
                continue;
            }
            jsonArr.push(jsonObject.league.standard.regularSeason.teams[i])
        }
        jsonArr.sort(function(a,b){return parseInt(a.teamId,10)-parseInt(b.teamId,10)});

        request(url_2, function(err, respon, body_part)
        {
            let jsonArr_2 = [];
            let json_Object = JSON.parse(body_part);
            for(let i=0; i< json_Object.league.standard.teams.length; i++)
            {
                jsonArr_2.push(json_Object.league.standard.teams[i]);
            }
            jsonArr_2.sort(function(a,b){return parseInt(a.teamId,10)-parseInt(b.teamId,10)});

            for(let i=0;i<jsonArr_2.length;i++)
            {
                let jsonelem_1 = jsonArr[i];
                let jsonelem_2 = jsonArr_2[i];
                let game_played = parseInt(jsonelem_2.win,10) + parseInt(jsonelem_2.loss,10);

                queryString = 'UPDATE team_stats SET '
                            + 'GP=' + game_played + ','
                            + 'win='+ parseInt(jsonelem_2.win,10) + ','
                            + 'loss='+ parseInt(jsonelem_2.loss,10) + ','
                            + 'winp='+ parseFloat(jsonelem_2.winPct) + ','
                            + 'min='+ parseFloat(jsonelem_1.min.avg) + ','
                            + 'pts='+ parseFloat(jsonelem_1.ppg.avg) + ','
                            + 'fgp='+ parseFloat(jsonelem_1.fgp.avg) + ','
                            + 'tpp='+ parseFloat(jsonelem_1.tpp.avg) + ','
                            + 'ftp='+ parseFloat(jsonelem_1.ftp.avg) + ','
                            + 'oreb='+ parseFloat(jsonelem_1.orpg.avg) + ','
                            + 'dreb='+ parseFloat(jsonelem_1.drpg.avg) + ','
                            + 'reb='+ parseFloat(jsonelem_1.trpg.avg) + ','
                            + 'ast='+ parseFloat(jsonelem_1.apg.avg) + ','
                            + 'tov='+ parseFloat(jsonelem_1.tpg.avg) + ','
                            + 'stl='+ parseFloat(jsonelem_1.spg.avg) + ','
                            + 'blk='+ parseFloat(jsonelem_1.bpg.avg) + ','
                            + 'pf=' + parseFloat(jsonelem_1.pfpg.avg) + ' '
                            + 'WHERE team_id=' + '"' + jsonelem_2.teamId + '"' + ';';     
                // console.log(queryString);

                connection.query(queryString, function (err, rows) { // send query to MySQL
                    if (err) throw err;
                    // console.log(rows); // log to check MySQL insertion result
                });
            }
        });
    });
    res.json('success');
    console.log('updateTeamStat done');
});


// API : insert game table rows
app.get('/insertGame', function (req, res, next) {
    // let url = "https://stats.nba.com/leaders";
    let url = "http://data.nba.net/10s/prod/v1/2018/schedule.json";
    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);

        // seasonStageId = {1:preseason, 2:regular season}
        // gameId = {, reuglar season : 0021800001~0021801230}
        // index = {preseason : 0~78, regular season : 79~1308}
        var reg = /(.+)T(.+)Z/;
        for(let i = 79; i< jsonObject.league.standard.length;i++)
        // for(let i = 79; i< 80;i++)
        {
            let jsonelem = jsonObject.league.standard[i];
            let hteam_score = 0;
            let vteam_score = 0;
            if(jsonelem.hTeam.score.length !== 0)
            {
                hteam_score = parseInt(jsonelem.hTeam.score, 10);
                vteam_score = parseInt(jsonelem.vTeam.score, 10);
            }

            queryString = 'INSERT INTO game (game_record_id, home_team_score, away_team_score) VALUES ("'
                    + jsonelem.gameId + '","'
                    + hteam_score + '","'
                    + vteam_score + '");';

            connection.query(queryString, function (err, rows) { // send query to MySQL
                if (err) throw err;
                // console.log(rows); // log to check MySQL insertion result
            });
        }
        res.json('success');
    });
    console.log('insertGame done');
});


// API : update game table rows
app.get('/updateGame', function (req, res, next) {
    let url = "http://data.nba.net/10s/prod/v1/2018/schedule.json";
    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);

        var reg = /(.+)T(.+)Z/;
        for(let i = 79; i< jsonObject.league.standard.length;i++)
        {
            let jsonelem = jsonObject.league.standard[i];
            let hteam_score = 0;
            let vteam_score = 0;
            if(jsonelem.hTeam.score.length !== 0)
            {
                hteam_score = parseInt(jsonelem.hTeam.score, 10);
                vteam_score = parseInt(jsonelem.vTeam.score, 10);
            }
            if(hteam_score === 0 || vteam_score === 0)
            {
                continue;
            }

            // UPDATE tablename SET filedA='456', fieldB='ABC' WHERE test='123' LIMIT 10;
            queryString = 'UPDATE game SET '
                         + 'home_team_score=' + hteam_score + ','
                         + 'away_team_score=' + vteam_score + ' '
                         + 'WHERE game_record_id=' + '"'+ jsonelem.gameId +'";'
            console.log(queryString);

            connection.query(queryString, function (err, rows) { // send query to MySQL
                if (err) throw err;
                // console.log(rows); // log to check MySQL insertion result
            });
        }
        res.json('success');
    });
    console.log('updateGame done');
});



// API : insert schedule table rows
app.get('/insertSchedule', function (req, res, next) {
    // let url = "https://stats.nba.com/leaders";
    let url = "http://data.nba.net/10s/prod/v1/2018/schedule.json";
    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);
        let date = new Date();

        // seasonStageId = {1:preseason, 2:regular season}
        // gameId = {, reuglar season : 0021800001~0021801230}
        // index = {preseason : 0~78, regular season : 79~1308}
        var reg = /(.+)T(.+)Z/;
        for(let i = 79; i< jsonObject.league.standard.length;i++)
        {
            // jsonArr.push(jsonObject.league.standard[i]);
            let jsonelem = jsonObject.league.standard[i];
            let date_and_time = reg.exec(jsonelem.startTimeUTC);
            queryString = 'INSERT INTO season_table (game_id, game_date, home_team, away_team) VALUES ("'
                    + jsonelem.gameId + '","'
                    + date_and_time[1] + ' ' + date_and_time[2] + '","'
                    + jsonelem.hTeam.teamId + '","'
                    + jsonelem.vTeam.teamId + '");';

            connection.query(queryString, function (err, rows) { // send query to MySQL
                if (err) throw err;
                // console.log(rows); // log to check MySQL insertion result
            });
        }
        // res.json('success');
    });
    console.log('insertSchedule done');
});


// API : insert team table rows
app.get('/insertTeam', function (req, res, next) {
    let url = "http://data.nba.net/data/10s/prod/v1/2018/teams.json";
    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);
        let count = 0;

        // console.log(jsonObject.league.standard.length);
        for(let i = 0; i<jsonObject.league.standard.length; i++)
        {
            if(jsonObject.league.standard[i].isNBAFranchise)
            {
                jsonArr.push(jsonObject.league.standard[i]);
            }
        }

        for(let i = 0; i< jsonArr.length; i++)
        {
            queryString = 'INSERT INTO team (team_name, team_three_letter_name, team_city, team_code) VALUES ("'
                    + jsonArr[i].fullName + '","'
                    + jsonArr[i].tricode + '","'
                    + jsonArr[i].city + '","'
                    + jsonArr[i].teamId + '");';

            connection.query(queryString, function (err, rows) { // send query to MySQL
                if (err) throw err;
                // console.log(rows); // log to check MySQL insertion result
            });
        }
        // res.json('success');
    });
    console.log('insertTeam done');
});



// API : insert player table rows
app.get('/insertPlayer', function (req, res, next) {
    let url = "http://data.nba.net/prod/v1/2018/players.json";
    request(url, function(error, response, body)
    {
        let jsonArr = [];
        let jsonObject = JSON.parse(body);

        for(let i = 0; i<jsonObject.league.standard.length; i++)
        {
            var jsonElem = jsonObject.league.standard[i];
            queryString = 'INSERT INTO player (player_first_name, player_last_name, team_number, player_id) VALUES ("'
                    + jsonElem.firstName + '","'
                    + jsonElem.lastName + '","'
                    + jsonElem.teamId + '","'
                    + jsonElem.personId + '");';

            connection.query(queryString, function (err, rows) { // send query to MySQL
                if (err) throw err;
                // console.log(rows); // log to check MySQL insertion result
            });
        }
        // res.json('success');
    });
    console.log('insertPlayer Done');
});

// API : insert player table rows
app.get('/insertPlayerStat', function (req, res, next) {
    connection.query("SELECT player_id FROM player", function (err, result, fields) {
            if (err) throw err;
            let second_url = "";
            for(let i=0; i<result.length; i++)
            {
                second_url= "http://data.nba.net/data/10s/prod/v1/2018/players/"+result[i].player_id+"_profile.json";
                request(second_url, function(error, response, player_stats)
                {
                    let playerjsonObject = JSON.parse(player_stats);
                    let json_elem = playerjsonObject.league.standard.stats.latest;

                    queryString = 'INSERT INTO player_stat (player_id, GP, MINUTE, pts, fgm, fga, fgp, tpm, tpa, tpp, ftm, fta, ftp, oreb, dreb, reb, ast, stl, blk, tov, dd2, td3) VALUES ("'
                                + result[i].player_id + '","'
                                + parseInt(json_elem.gamesPlayed,10) + '","'
                                + parseInt(json_elem.min,10) + '","'
                                + parseFloat(json_elem.ppg) + '","'
                                + parseInt(json_elem.fgm,10) + '","'
                                + parseInt(json_elem.fga,10) + '","'
                                + parseFloat(json_elem.fgp) + '","'
                                + parseInt(json_elem.tpm,10) + '","'
                                + parseInt(json_elem.tpa,10) + '","'
                                + parseFloat(json_elem.tpp) + '","'
                                + parseInt(json_elem.ftm,10) + '","'
                                + parseInt(json_elem.fta,10) + '","'
                                + parseFloat(json_elem.ftp) + '","'
                                + parseInt(json_elem.offReb,10) + '","'
                                + parseInt(json_elem.defReb,10) + '","'
                                + parseInt(json_elem.totReb,10) + '","'
                                + parseInt(json_elem.assists,10) + '","'
                                + parseInt(json_elem.steals,10) + '","'
                                + parseInt(json_elem.blocks,10) + '","'
                                + parseInt(json_elem.turnovers,10) + '","'
                                + parseInt(json_elem.dd2,10) + '","'
                                + parseInt(json_elem.td3,10) + '");';

                    connection.query(queryString, function (err, rows) { // send query to MySQL
                        if (err)
                        {
                            console.log(json_elem);
                            console.log(result[i].player_id);
                            throw err;
                        }
                        // console.log(rows); // log to check MySQL insertion result
                    });
                });
            }
        });
    console.log('insertPlayerStat done');
    // res.json('success');
});

// API : update player table rows
app.get('/updatePlayerStat', function (req, res, next) {
    connection.query("SELECT player_id FROM player", function (err, result, fields) {
            if (err) throw err;
            let second_url = "";
            for(let i=0; i<result.length; i++)
            {
                second_url= "http://data.nba.net/data/10s/prod/v1/2018/players/"+result[i].player_id+"_profile.json";
                request(second_url, function(error, response, player_stats)
                {
                    let playerjsonObject = JSON.parse(player_stats);
                    let json_elem = playerjsonObject.league.standard.stats.latest;

                    queryString = 'UPDATE player_stat SET '
                                + 'GP=' + parseInt(json_elem.gamesPlayed,10) + ','
                                + 'MINUTE=' + parseInt(json_elem.min,10) + ','
                                + 'pts='+ parseFloat(json_elem.ppg) + ','
                                + 'fgm='+ parseInt(json_elem.fgm,10) + ','
                                + 'fga='+ parseInt(json_elem.fga,10) + ','
                                + 'fgp='+ parseFloat(json_elem.fgp) + ','
                                + 'tpm='+ parseInt(json_elem.tpm,10) + ','
                                + 'tpa='+ parseInt(json_elem.tpa,10) + ','
                                + 'tpp='+ parseFloat(json_elem.tpp) + ','
                                + 'ftm='+ parseInt(json_elem.ftm,10) + ','
                                + 'fta='+ parseInt(json_elem.fta,10) + ','
                                + 'ftp='+ parseFloat(json_elem.ftp) + ','
                                + 'oreb='+ parseInt(json_elem.offReb,10) + ','
                                + 'dreb='+ parseInt(json_elem.defReb,10) + ','
                                + 'reb='+ parseInt(json_elem.totReb,10) + ','
                                + 'ast='+ parseInt(json_elem.assists,10) + ','
                                + 'stl='+ parseInt(json_elem.steals,10) + ','
                                + 'blk='+ parseInt(json_elem.blocks,10) + ','
                                + 'tov='+ parseInt(json_elem.turnovers,10) + ','
                                + 'dd2='+ parseInt(json_elem.dd2,10) + ','
                                + 'td3='+ parseInt(json_elem.td3,10) + ' '
                                + 'WHERE player_id=' + '"'+ result[i].player_id + '";';

                    connection.query(queryString, function (err, rows) { // send query to MySQL
                        if (err)
                        {
                            console.log(json_elem);
                            console.log(result[i].player_id);
                            throw err;
                        }
                        // console.log(rows); // log to check MySQL insertion result
                    });
                });
            }
        });
    console.log('updatePlayerStat done');
    res.json('success');
});




///////////////////////////////////////////////
app.get('/testAPI', function(req, res){

  queryString = 'SELECT * from team';

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) throw err;
      // console.log(rows); // log to check MySQL insertion result
      console.log(rows);
      res.send(rows);
  });
});

///////////////////////////////////////////////
//for db GET
app.get('/teamAPI', function(req, res){

    queryString = 'SELECT team_name, team_three_letter_name, team_city, GP, win, loss, winp, min, pts, fgp, tpp, ftp, oreb, dreb, reb, ast, tov, stl, blk, pf ' +
                  'FROM team ' +
                  'LEFT JOIN team_stats ' +
                  'ON team.team_code = team_stats.team_id ' +
                  'ORDER BY winp DESC';

    connection.query(queryString, function (err, rows) { // send query to MySQL
        if (err) throw err;
        // console.log(rows); // log to check MySQL insertion result
        res.send(rows);
  });
});

/*
app.get('/teamAPI', function(req, res){

  queryString = 'SELECT team_name, team_three_letter_name, team_city from team ORDER BY team_three_letter_name DESC';

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) throw err;
      // console.log(rows); // log to check MySQL insertion result
      res.send(rows);
  });
});
*/

app.get('/seasonAPI', function(req, res){

  queryString = 'SELECT DATE_ADD(game_date, INTERVAL 9 HOUR) AS game_date, home_team_name, home_team_score, away_team_name, away_team_score ' +
                'FROM season_table as s ' +
                'LEFT JOIN ' +
                '(SELECT team_code as home_code, team_name as home_team_name ' +
                'FROM team) AS home ' +
                'ON s.home_team = home.home_code ' +
                'LEFT JOIN ' +
                '(SELECT team_code as away_code, team_name as away_team_name ' +
                'FROM team) AS away ' +
                'ON s.away_team = away.away_code ' +
                'LEFT JOIN game ' +
                'ON s.game_id = game.game_record_id ' +
                'WHERE DATE(game_date) BETWEEN (NOW() - INTERVAL 7 DAY) AND (NOW() + INTERVAL 7 DAY) ' +
                'ORDER BY game_date';

 console.log(queryString);

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) throw err;
      // console.log(rows); // log to check MySQL insertion result
      res.send(rows);
  });
});

app.get('/playerAPI', function(req, res){

  queryString =
                'SELECT player_first_name, player_last_name, team_name, GP, MINUTE, pts, fgm, fga, fgp, tpm, tpa, tpp, ftm, fta, ftp, oreb, dreb, reb, ast, stl, blk, tov, dd2, td3 FROM player_all_stat ' +
                'ORDER BY pts DESC ' +
                'LIMIT 50';

 console.log(queryString);

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) throw err;
      // console.log(rows); // log to check MySQL insertion result
      res.send(rows);
  });
});

app.get('/playerAverage', function(req, res){

  queryString = 'SELECT COUNT(*) AS totalPlayer, ROUND(AVG(GP), 2) AS GP, ROUND(AVG(MINUTE), 2) AS MINUTE, ROUND(AVG(pts), 2) AS pts, ' +
  'ROUND(AVG(fgm), 2) AS fgm, ROUND(AVG(fga), 2) AS fga, ROUND(AVG(fgp), 2) AS fgp, ROUND(AVG(tpm), 2) AS tpm, ' +
  'ROUND(AVG(tpa), 2) AS tpa, ROUND(AVG(tpp), 2) AS tpp, ROUND(AVG(ftm), 2) AS ftm, ROUND(AVG(fta), 2) AS fta, ' +
  'ROUND(AVG(ftp), 2) AS ftp, ROUND(AVG(oreb), 2) AS oreb, ROUND(AVG(dreb), 2) AS dreb, ROUND(AVG(reb), 2) AS reb, ' +
  'ROUND(AVG(ast), 2) AS ast, ROUND(AVG(stl), 2) AS st1, ROUND(AVG(blk), 2) AS blk, ROUND(AVG(tov), 2) AS tov, ' +
  'ROUND(AVG(dd2), 2) AS dd2, ROUND(AVG(td3), 2) AS td3 ' +
                'FROM player_stat ';

 console.log(queryString);

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) throw err;
      // console.log(rows); // log to check MySQL insertion result
      res.send(rows);
  });
});

app.post('/customPlayerInsert', function(req, res){

  console.log(req.body);
  queryString = 'INSERT INTO custom_player ' +
                  'SELECT * ' +
                  'FROM player_all_stat ' +
                  'WHERE player_first_name = "' +
                  req.body.first +
                  '" AND player_last_name = "' +
                  req.body.last + '"';

  console.log(queryString);

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) {
        res.send({sendCode: '2'});
        return;
      }

      if (rows.affectedRows == 1){
        res.send({sendCode: '0'});
      }
      else{
        res.send({sendCode: '1'});
      }
      // console.log(rows); // log to check MySQL insertion result

  });
});

app.get('/customPlayerAPI', function(req, res){

  queryString = 'SELECT player_first_name, player_last_name, team_name, GP, MINUTE, pts, fgm, fga, fgp, tpm, tpa, tpp, ftm, fta, ftp, oreb, dreb, reb, ast, stl, blk, tov, dd2, td3 FROM custom_player';

 console.log(queryString);

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) throw err;
      // console.log(rows); // log to check MySQL insertion result
      res.send(rows);
  });
});

app.post('/customPlayerDelete', function(req, res){

  console.log(req.body);
  queryString = 'DELETE FROM custom_player ' +
                  'WHERE player_first_name = "' +
                  req.body.first +
                  '" AND player_last_name = "' +
                  req.body.last + '"';

  console.log(queryString);

  connection.query(queryString, function (err, rows) { // send query to MySQL
      if (err) {
        res.send({sendCode: '3'});
        return;
      }
      // console.log(rows); // log to check MySQL insertion result
      if (rows.affectedRows == 1){
        res.send({sendCode: '0'});
      }
      else{
        res.send({sendCode: '1'});
      }
  });
});
/*
app.post('/insertAPI', function (req, res) {
	console.log(req.body); // log to the node.js server

	queryStr = 'INSERT INTO user_tbl (first_name, last_name, gender) VALUES ("'
					+ req.body.first_name + '","'
					+ req.body.last_name + '","'
					+ req.body.gender + '");';

	console.log("Insert query: " + queryStr); // you may check the queryStr

	connection.query(queryStr, function (err, rows) { // send query to MySQL
		if (err) throw err;
		console.log(rows); // log to check MySQL insertion result
		res.redirect('/'); // after submission, redirect to the base url
	})
});
*/
