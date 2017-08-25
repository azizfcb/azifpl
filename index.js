var q = require("q");
var jsonGroupBy = require("json-groupby")
var rp = require('request-promise');

var deferred = q.defer();
var connected = false;
var cookieJar = rp.jar();
var bootstrapStaticUrl = "https://fantasy.premierleague.com/drf/bootstrap-static"
var teams = {
    1: "Arsenal",
    2: "Bournemouth",
    3: "Brighton",
    4: "Burnley",
    5: "Chelsea",
    6: "Crystal Palace",
    7: "Everton",
    8: "Huddersfield",
    9: "Leicester",
    10: "Liverpool",
    11: "Man City",
    12: "Newcastle",
    13: "Newcastle",
    14: "Stoke ",
    15: "ilkhg dfr",
    16: "Swansea",
    17: "Spurs ",
    18: "Watford",
    19: "West Brom",
    20: "West Ham"
}
// **************************************************** Basic features ******************************************************** //

exports.getPlayerLeagues = function (playerId, leagueType) {
    var url = "https://fantasy.premierleague.com/drf/entry/" + playerId, arr = [], options = {uri: url, json: true};
    // GET Request
    rp(options).then(function (response) {
        response.leagues[leagueType].forEach(function (e) {
            arr.push({leagueName: e.name, rank: e.entry_rank, leagueActiveSince: e.start_event, rankState: e.entry_movement})
        })
        var newJson = {}
        newJson.player = {
            teamId: response.entry.id,
            firstName: response.entry.player_first_name,
            lastName: response.entry.player_last_name,
            country: {name: response.entry.player_region_name, id: response.entry.player_region_id},
            teamName: response.entry.name,
            startedEvent: response.entry.started_event
        }
        arr.length > 0 ? newJson.league = arr : null;
        deferred.resolve(arr.length === 0 ? {success: false, msg: "Player :" + playerId + "No League :" + leagueType} : newJson)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

exports.getGameweekGlobalData = function (playerId, event) {

    var url = "https://fantasy.premierleague.com/drf/entry/" + playerId + "/event/" + event + "/picks", arr = [], options = {uri: url, json: true};
    // GET Request
    rp(options).then(function (response) {
        response.event.averageScore = response.event.average_entry_score;
        response.event.deadline = {human: response.event.deadline_time_formatted, timestamp: response.event.deadline_time_epoch};
        delete response.event.deadline_time_formatted;
        delete response.event.deadline_time;
        delete response.event.deadline_time_epoch;
        delete response.event.deadline_time_game_offset;
        delete response.event.data_checked;
        delete response.event.average_entry_score;
        deferred.resolve(response.event)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

exports.getEventActiveChips = function (playerId, event) {

    var url = "https://fantasy.premierleague.com/drf/entry/" + playerId + "/event/" + event + "/picks", arr = [], options = {uri: url, json: true};
    // GET Request
    rp(options).then(function (response) {
        deferred.resolve(response.active_chip)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

exports.getGameweekPlayerData = function (playerId, event) {

    var url = "https://fantasy.premierleague.com/drf/entry/" + playerId + "/event/" + event + "/picks", arr = [], options = {uri: url, json: true};
    // GET Request
    rp(options).then(function (response) {

        response.entry_history.benchPoints = response.entry_history.points_on_bench;
        response.entry_history.playerId = response.entry_history.entry;
        response.entry_history.gameweekNumber = response.entry_history.event;
        response.entry_history.gameweekTransfers = {number: response.entry_history.event_transfers, cost: response.entry_history.event_transfers_cost};
        response.entry_history.teamValue = response.entry_history.value;
        response.entry_history.totalPoints = response.entry_history.total_points;
        delete response.entry_history.entry;
        delete response.entry_history.event;
        delete response.entry_history.event_transfers;
        delete response.entry_history.event_transfers_cost;
        delete response.entry_history.value;
        delete response.entry_history.total_points;
        delete response.entry_history.rank;
        delete response.entry_history.target;
        delete response.entry_history.rank_sort;
        delete response.entry_history.points_on_bench;
        delete response.entry_history.movement;

        deferred.resolve(response.entry_history)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

exports.getPremierLeagueTeamPlayers = function (teamId) {
    var url = "https://fantasy.premierleague.com/drf/elements/", arr = [], options = {uri: url, json: true}, newJson = {};
    // GET Request
    rp(options).then(function (response) {
        var obj = jsonGroupBy(response, ['team'])
        var keys = Object.keys(obj)
        if (teamId === undefined) {
            arr = [];
            keys.forEach(function (key) {
                newJson = {};
                newJson = {}
                newJson.teamId = key;
                newJson.teamName = teams[key];
                newJson.teamPlayers = obj[key];
                arr.push(newJson)
            })
        } else {
            newJson.teamName = teams[teamId];
            newJson.teamId = teamId;
            newJson.teamPlayers = obj[teamId];
            arr = newJson;
        }
        deferred.resolve(arr)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getPremierLeagueTeams = function (teamId) {
    options = {uri: bootstrapStaticUrl, json: true}
    rp(options).then(function (response) {
        var data = (teamId === undefined) ? response.teams : response.teams.filter(function (e) {
            return e.id === teamId;
        })
        deferred.resolve(data)
    }, function (error) {
        console.log('error doing HTTP request to ' + bootstrapStaticUrl);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

//exports.fantasyPlayersCount = function (teamId) {
//
//}
// **************************************************************************************************************************** //

// ************************************************ extra features ************************************************************ //

// --------------------- fantasy teams ------------------------- //

exports.getFantasyTeamAverage = function (leagueId) {

    var url = "https://fantasy.premierleague.com/drf/entry/" + leagueId + "/history", arr = [], options = {uri: url, json: true};
    var average = 0;
    rp(options).then(function (response) {
        response.history.forEach(function (e) {
            average = e.points + average;
        })
        deferred.resolve(average / response.history.length)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getMaxPoints = function (teamId) {
    var url = "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", arr = [], options = {uri: url, json: true};
    var newJson = {};
    rp(options).then(function (response) {
        newJson.playerId = teamId,
                newJson.data = {
                    maxGameweekPoints: Math.max.apply(Math, response.history.map(function (o) {
                        return o.points;
                    })),
                    maxBenchedPoints: Math.max.apply(Math, response.history.map(function (o) {
                        return o.points_on_bench;
                    })),
                }
        deferred.resolve(newJson)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getTeamBestandWorstOverallRank = function (teamId) {
    var url = "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", arr = [], options = {uri: url, json: true};
    var newJson = {};
    rp(options).then(function (response) {
        newJson.playerId = teamId;
        newJson.data = {
            bestOverAllRank: Math.min.apply(Math, response.history.map(function (o) {
                return o.overall_rank;
            })),
            worstOverAllRank: Math.max.apply(Math, response.history.map(function (o) {
                return o.overall_rank;
            })),
        }
        deferred.resolve(newJson)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getTotalTransfersCost = function (teamId) {
    var url = "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", arr = [], options = {uri: url, json: true};
    var newJson = {}, sum = 0;
    rp(options).then(function (response) {
        newJson.playerId = teamId;
        response.history.forEach(function (e) {
            sum = sum + e.event_transfers_cost;
        });
        newJson.data = {
            totalTransferCost: sum
        };
        deferred.resolve(newJson)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
};

//exports.compareTwoTeams = function (teamId1, teamId2) {}
//
//exports.chipsPoints = function (teamId) {}
// ------------------------------------------------------------- //

// --------------------- fantasy leagues -------------------------//
exports.getLeagueTopTenPlayers = function (leagueId) {
    var url = "https://fantasy.premierleague.com/drf/leagues-classic-standings/" + leagueId, arr = [], options = {uri: url, json: true};
    // GET Request
    rp(options).then(function (response) {
        arr = response.standings.results.filter(function (e, i) {
            return i <= 9;
        })
        deferred.resolve(arr)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}
// ------------------------------------------------------------- //

// ******************************************************************************************************************************** //