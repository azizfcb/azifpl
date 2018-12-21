var q = require("q");
var jsonGroupBy = require("json-groupby")

var rp = require('request-promise');
var cookieJar = rp.jar();
var bootstrapStaticUrl = "https://fantasy.premierleague.com/drf/bootstrap-static";
var dreamTeamUrl = "https://fantasy.premierleague.com/drf/dream-team/";
var entryUrl = "https://fantasy.premierleague.com/drf/entry/"
var elementUrl = "https://fantasy.premierleague.com/drf/elements/"
var playersIconesUrl = "https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p"
var myTeamUrl = "https://fantasy.premierleague.com/drf/my-team/"

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
    12: "Man Utd",
    13: "Newcastle",
    14: "Southampton ",
    15: "Stoke",
    16: "Swansea",
    17: "Spurs ",
    18: "Watford",
    19: "West Brom",
    20: "West Ham"
}
// **************************************************** Basic features ******************************************************** //


// get transfer history
exports.getTransferHistory = function (teamId) {
    var options = {uri: entryUrl + teamId + "/transfers", json: true};
    // GET Request
    rp(options).then(function (response) {
        deferred.resolve(response.history);
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

// leagues that a player is a member of ( classic, h2h, cup )
exports.getPlayerSubscribedLeagues = function (playerId, leagueType) {
    var options = {uri: entryUrl + playerId, json: true};
    // GET Request
    rp(options).then(function (response) {
        leagueType === undefined ? deferred.resolve(response.leagues) : deferred.resolve({type: leagueType, leagues: response.leagues[leagueType]});
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

// high scoring entry, average score, deadline etc..
exports.getGameweekGlobalData = function (playerId, event) {

    var options = {uri: entryUrl + playerId + "/event/" + event + "/picks", json: true};
    // GET Request
    rp(options).then(function (response) {
        deferred.resolve(response.event);
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

//get active chips of the specified gameweek
exports.getEventActiveChips = function (playerId, event) {

    var options = {uri: entryUrl + playerId + "/event/" + event + "/picks", json: true};
    // GET Request
    rp(options).then(function (response) {
        deferred.resolve(response.active_chip)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)

    })
    return deferred.promise;
}

exports.getGameweekPlayerData = function (playerId, event) {

    var options = {uri: entryUrl + playerId + "/event/" + event + "/picks", json: true};
    // GET Request
    rp(options).then(function (response) {
        deferred.resolve(response.entry_history)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

// get All players of all teams if team id is not specified, otherwise returns all players
exports.getPremierLeagueTeamPlayers = function (teamId) {
    var arr = [], options = {uri: elementUrl, json: true}, newJson = {};
    // GET Request
    rp(options).then(function (response) {
        var obj = jsonGroupBy(response, ['team'])
        var keys = Object.keys(obj)
        if (teamId === undefined) {
            keys.forEach(function (key) {
                newJson = {};
                newJson.teamId = key;
                newJson.teamName = teams[key];
                newJson.teamPlayers = obj[key];
                newJson.teamPlayers.forEach(function (e) {
                    e.photo = playersIconesUrl + (e.photo).replace("jpg", "png");
                });
                arr.push(newJson)
            })
        } else {
            newJson.teamName = teams[teamId];
            newJson.teamId = teamId;
            newJson.teamPlayers = obj[teamId];
            newJson.teamPlayers.forEach(function (e) {
                e.photo = playersIconesUrl + (e.photo).replace("jpg", "png");
            })

            arr = newJson;
        }
        deferred.resolve(arr)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

// get Premeir league details if teamId is not specified, otherwise fetsh all teams details
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

// self explanatory 
exports.getEventDreamTeam = function (event) {
    options = {uri: dreamTeamUrl + event, json: true}
    if (Number.isInteger(event) && event > 0 && event <= 38) {
        rp(options).then(function (response) {
            deferred.resolve(response.team)
        }, function (error) {
            console.log('error doing HTTP request to ' + options.uri);
            deferred.reject(error);
            console.log(error)
        })
    } else {
        deferred.reject("event number is not valid!");
    }
    return deferred.promise;
}

// self explanatory
exports.getEventFixtures = function (event) {
    options = {uri: dreamTeamUrl + event, json: true}
    if (Number.isInteger(event) && event > 0 && event <= 38) {
        rp(options).then(function (response) {
            deferred.resolve(response.fixtures)
        }, function (error) {
            console.log('error doing HTTP request to ' + options.uri);
            deferred.reject(error);
            console.log(error)
        })
    } else {
        deferred.reject("event number is not valid!");
    }
    return deferred.promise;
}

// ***************************************************************************************************************************** //

// *************************************************** extra features ********************************************************** // 

exports.getFantasyTeamAverage = function (leagueId) {

    var options = {uri: entryUrl + leagueId + "/history", json: true};
    var deferred = q.defer();
    var average = 0;
    rp(options).then(function (response) {
        response.history.forEach(function (e) {
            average = e.points + average;
        })
        deferred.resolve(average / response.history.length);
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getMaxPoints = function (teamId) {

    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
    var deferred = q.defer();
    rp(options).then(function (response) {
        var data = maxBenchedAndMaxPoints(response.history)
        deferred.resolve(data)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getTeamBestandWorstOverallRank = function (teamId) {
    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
    var deferred = q.defer();
    var newJson = {}, maxEvent, minEvent;
    rp(options).then(function (response) {
        newJson.playerId = teamId;
        var maxValue = Math.min.apply(Math, response.history.map(function (o) {
            return o.overall_rank;
        }))
        var minValue = Math.max.apply(Math, response.history.map(function (o) {
            return o.overall_rank;
        }))
        response.history.forEach(function (e, i) {
            if (e.overall_rank === maxValue) {
                maxEvent = i + 1;
            } else if (e.overall_rank === minValue) {
                minEvent = i + 1
            }
        })
        newJson.data = {
            bestOverAllRank: {Value: maxValue, eventNumber: maxEvent},
            worstOverAllRank: {Value: minValue, eventNumber: minEvent}
        }
        deferred.resolve(newJson)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    });
    return deferred.promise;
}

// total transfer cost
// 100%
exports.getTotalTransfersCost = function (teamId) {
    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
    var deferred = q.defer();
    rp(options).then(function (response) {
        deferred.resolve(totalTransfercost(response.history))
    }, function (error) {
        deferred.reject(error);
    })
    return deferred.promise;
};
// get top 10 players of classic league
// 100%
exports.getClassicLeagueTopTenPlayers = function (leagueId, number) {

    var deferred = q.defer();
    var url = "https://fantasy.premierleague.com/drf/leagues-classic-standings/" + leagueId, arr = [], options = {uri: url, json: true};
    // GET Request
    rp(options).then(function (response) {
        var arr = []
        if (number != undefined) {
            arr = response.standings.results.filter(function (e, i) {
                return i <= undefined;
            })
        } else {
            arr = response.standings.results
        }

        deferred.resolve(arr)
    }, function (error) {
        console.log('error doing HTTP request to ' + url);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

//get acivated chips, the exact event and the corresponding points
// 100%
exports.chipsPoints = function (teamId) {
    var output = [];
    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
    var deferred = q.defer();
    rp(options).then(function (response) {

        history = response.history
        chips = response.chips

        chips.forEach(function (e, v) {
            output.push({
                "chips": e.name,
                "event": e.event,
                "points": history.find(x => x.event === e.event).points
            })
        })
        deferred.resolve(output)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

//calculate h2h betweew fantasy players
// 100%
exports.TwoTeamsH2H = function (teamId_1, teamId_2) {

    var deferred = q.defer();
    var output = {};
    a = 0;
    b = 0;
    x = 0
    var options_1 = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId_1 + "/history", json: true};
    var options_2 = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId_2 + "/history", json: true};
    rp(options_1).then(function (response) {
        var playerName_1 = response.entry.name
        var playerData_1 = response.history
        rp(options_2).then(function (response) {
            var playerName_2 = response.entry.name
            var playerData_2 = response.history

            max = Math.max(playerData_1[0].event, playerData_2[0].event)

            playerData_1 = playerData_1.filter(x => x.event >= max)
            playerData_2 = playerData_2.filter(x => x.event >= max)

            for (i = 0; i < playerData_1.length; i++) {
                if (playerData_1[i].points > playerData_2[i].points)
                    a++;
                else if (playerData_1[i].points < playerData_2[i].points)
                    b++;
                else
                    x++;
            }
            output = {player1: {name: playerName_1, wins: a}, player2: {name: playerName_2, wins: b}, draw: x}
            deferred.resolve(output)
        }, function (error) {
            console.log('error doing HTTP request to ' + options.uri);
            deferred.reject(error);
            console.log(error)
        })
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getCupTeams = function (leagueId) {
    var deferred = q.defer();
    var LeagueUrl = "https://fantasy.premierleague.com/drf/leagues-classic-standings/" + leagueId, arr = [], options = {uri: LeagueUrl, json: true};
    // GET Request
    rp(options).then(function (response) {
        var output = [];
        var players = response.standings.results
        var allPromises = [];
        players.forEach(function (e) {
            options = {uri: entryUrl + e.entry, json: true}
            allPromises.push(new Promise(function (resolve, reject) {
                rp(options).then(function (response) {
                    var cupData = response.leagues.cup
                    var x = {
                        playerId: e.entry,
                        playerName: response.entry.player_first_name + ' ' + response.entry.player_last_name,
                        teamName: response.entry.name,
                        cupRoundsPlayed: {roundsPlayed: cupData.length, playedUntil: cupData.length > 0 ? cupData[cupData.length - 1].event : null},
                        cupStatus: stillInCup(cupData, e.entry)}
                    resolve(x)
                }, function (error) {
                    reject(error)
                })
            }))
        })
        console.log(allPromises.length)
        if (allPromises.length == response.standings.results.length) {
            Promise.all(allPromises).then(function (values) {
                deferred.resolve(values)
            });
        }

    }, function (error) {
        deferred.reject(error);
    })
    return deferred.promise;
}

exports.gameweekAverage = function (leagueId) {
    var deferred = q.defer();
    options = {uri: bootstrapStaticUrl, json: true};
    // GET Request
    rp(options).then(function (response) {
        var currentEvent = response["current-event"];
        var average = response.events[currentEvent - 1].average_entry_score;
        deferred.resolve({
            currentEvent: currentEvent,
            average: average
        })
    }, function (error) {
        deferred.reject(error);
    })
    return deferred.promise;
}

exports.highestLowest = function (leagueId) {



    var deferred = q.defer();
    var LeagueUrl = "https://fantasy.premierleague.com/drf/leagues-classic-standings/" + leagueId, arr = [], options = {uri: LeagueUrl, json: true};
    // GET Request
    rp(options).then(function (response) {

        var output = [];
        var players = response.standings.results
        var allPromises = [];
        players.forEach(function (e) {

            options = {uri: entryUrl + e.entry, json: true}
            allPromises.push(new Promise(function (resolve, reject) {
                getMaxPoints(e.entry).then(function (res) {
                    res.teamName = e.entry_name
                    resolve(res)
                }, function (err) {
                    resolve(err)
                })
            }))
        })
        if (allPromises.length == response.standings.results.length) {
            Promise.all(allPromises).then(function (values) {
                deferred.resolve(values)
            });
        }
    }, function (error) {
        deferred.reject(error);
    })
    return deferred.promise;
}

exports.teamStats = function (teamId) {
    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
    var deferred = q.defer();
    rp(options).then(function (response) {

        maxMinPoints = maxBenchedAndMaxPoints(response.history)
        chips = chipsPoints(response.chips, response.history)
        cupData = stillInCup(response.leagues.cup,teamId)
        xxxx = totalTransfercost(response.history)

        deferred.resolve({data: {maxMinPoints: maxMinPoints, chips: chips, totalTransfercost: xxxx,cupData:cupData}})
        
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

stillInCup = function (cupData, playerId) {
    return cupData[cupData.length - 1] != undefined && (cupData[cupData.length - 1].winner == null || cupData[cupData.length - 1].winner == playerId)
}

maxBenchedAndMaxPoints = function (history) {

    var maxPoints = [history.reduce(function (prev, current) {
            return (prev.points > current.points) ? prev : current
        })].map(function (x) {
        return {value: x.points, event: x.event}
    })[0]
    var minPoints = [history.reduce(function (prev, current) {
            return (prev.points < current.points) ? prev : current
        })].map(function (x) {
        return {value: x.points, event: x.event}
    })[0]
    var maxBenchedPoints = [history.reduce(function (prev, current) {
            return (prev.points_on_bench > current.points_on_bench) ? prev : current
        })].map(function (x) {
        return {value: x.points_on_bench, event: x.event}
    })[0]

    return {
        maxPoints: maxPoints,
        minPoints: minPoints,
        maxBenchedPoints: maxBenchedPoints,
    }
}

chipsPoints = function (chips, history) {

    var output = []
    chips.forEach(function (e, v) {
        output.push({
            "chips": e.name,
            "event": e.event,
            "points": history.find(x => x.event === e.event).points
        })
    })
    return output;
}

totalTransfercost = function (history) {
    var sum = 0
    history.forEach(function (e) {
        sum = sum + e.event_transfers_cost;
    });
    return sum
}