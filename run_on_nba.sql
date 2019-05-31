CREATE DATABASE IF NOT EXISTS nba_db;
USE nba_db;

CREATE TABLE IF NOT EXISTS game (
	game_record_id VARCHAR(20) NOT NULL,
    home_team_score SMALLINT,
    away_team_score SMALLINT,
	PRIMARY KEY (game_record_id)
);

CREATE TABLE IF NOT EXISTS team (
    team_name VARCHAR(32) NOT NULL,
    team_three_letter_name VARCHAR(3) NOT NULL,
    team_city VARCHAR(32) NOT NULL,
    team_code VARCHAR(20) NOT NULL,
	PRIMARY KEY (team_three_letter_name)
);

CREATE TABLE IF NOT EXISTS season_table (
	game_id VARCHAR(20) NOT NULL,
    game_date DATETIME NOT NULL,
    home_team VARCHAR(32) NOT NULL,
    away_team VARCHAR(32) NOT NULL,
	PRIMARY KEY (game_id)
);

CREATE TABLE IF NOT EXISTS player (
	player_first_name VARCHAR(32) NOT NULL,
    player_last_name VARCHAR(32) NOT NULL,
    team_number VARCHAR(20) NOT NULL,
    player_id VARCHAR(10) NOT NULL,
  	PRIMARY KEY (player_id)
);

CREATE TABLE IF NOT EXISTS player_stat (
    player_id VARCHAR(10) NOT NULL,
    GP SMALLINT,
    MINUTE SMALLINT,
    pts FLOAT(4,1),
    fgm SMALLINT,
    fga SMALLINT,
    fgp FLOAT(4,1),
    tpm SMALLINT,
    tpa SMALLINT,
    tpp FLOAT(4,1),
    ftm SMALLINT,
    fta SMALLINT,
    ftp FLOAT(4,1),
    oreb SMALLINT,
    dreb SMALLINT,
    reb SMALLINT,
    ast SMALLINT,
    stl SMALLINT,
    blk SMALLINT,
    tov SMALLINT,
    dd2 SMALLINT,
    td3 SMALLINT,
	PRIMARY KEY (player_id)
);

CREATE TABLE IF NOT EXISTS team_stats (
		team_id VARCHAR(20) NOT NULL,
		GP TINYINT unsigned NOT NULL,
		win TINYINT unsigned NOT NULL,
		loss TINYINT unsigned NOT NULL,
		winp FLOAT(4,3) NOT NULL,
		min FLOAT(4,1) NOT NULL,
		pts FLOAT(4,1) NOT NULL,
		fgp FLOAT(5,2) NOT NULL,
		tpp FLOAT(5,2) NOT NULL,
		ftp FLOAT(5,2) NOT NULL,
		oreb FLOAT(4,1) NOT NULL,
		dreb FLOAT(4,1) NOT NULL,
		reb FLOAT(4,1) NOT NULL,
		ast FLOAT(4,1) NOT NULL,
		tov FLOAT(4,1) NOT NULL,
		stl FLOAT(4,1) NOT NULL,
		blk FLOAT(4,1) NOT NULL,
		pf FLOAT(4,1) NOT NULL,
	PRIMARY KEY (team_id)
);

CREATE TABLE IF NOT EXISTS custom_player (
		player_id VARCHAR(10) NOT NULL,
		player_first_name VARCHAR(32) NOT NULL,
		player_last_name VARCHAR(32) NOT NULL,
		team_name VARCHAR(32) NOT NULL,
    GP SMALLINT,
    MINUTE SMALLINT,
    pts FLOAT(4,1),
    fgm SMALLINT,
    fga SMALLINT,
    fgp FLOAT(4,1),
    tpm SMALLINT,
    tpa SMALLINT,
    tpp FLOAT(4,1),
    ftm SMALLINT,
    fta SMALLINT,
    ftp FLOAT(4,1),
    oreb SMALLINT,
    dreb SMALLINT,
    reb SMALLINT,
    ast SMALLINT,
    stl SMALLINT,
    blk SMALLINT,
    tov SMALLINT,
    dd2 SMALLINT,
    td3 SMALLINT,
	PRIMARY KEY (player_id)
);

CREATE OR REPLACE VIEW player_all_stat AS
	SELECT player.player_id, player_first_name, player_last_name, team_name, GP, MINUTE, pts, fgm, fga, fgp, tpm, tpa, tpp, ftm, fta, ftp, oreb, dreb, reb, ast, stl, blk, tov, dd2, td3
	FROM player
	LEFT JOIN team
	ON player.team_number = team.team_code
	LEFT JOIN player_stat
	ON player.player_id = player_stat.player_id;



DELIMITER ///
CREATE TRIGGER after_update_player_stat
 AFTER UPDATE ON player_stat 
 FOR EACH ROW BEGIN 
        UPDATE custom_player 
        SET GP    =  NEW.GP 
        , custom_player.MINUTE  =  NEW.MINUTE
        , custom_player.pts     =  NEW.pts 
        , custom_player.fgm     =  NEW.fgm 
        , custom_player.fga     =  NEW.fga 
        , custom_player.fgp     =  NEW.fgp 
        , custom_player.tpm     =  NEW.tpm  
        , custom_player.tpa     =  NEW.tpa  
        , custom_player.tpp     =  NEW.tpp  
        , custom_player.ftm     =  NEW.ftm  
        , custom_player.fta     =  NEW.fta  
        , custom_player.ftp     =  NEW.ftp 
        , custom_player.oreb    =  NEW.oreb
        , custom_player.dreb    =  NEW.dreb
        , custom_player.reb     =  NEW.reb
        , custom_player.ast     =  NEW.ast
        , custom_player.stl     =  NEW.stl
        , custom_player.blk     =  NEW.blk
        , custom_player.tov     =  NEW.tov
        , custom_player.dd2     =  NEW.dd2
        , custom_player.td3     =  NEW.td3 
        WHERE custom_player.player_id = NEW.player_id;
END; ///
DELIMITER ;


CREATE USER IF NOT EXISTS 'nba_young'@'localhost' IDENTIFIED BY 'cs360';
GRANT ALL PRIVILEGES ON nba_db.* TO 'nba_young'@'localhost';
