var q = require("q");
var jsonGroupBy = require("json-groupby")
var rp = require('request-promise');

var deferred = q.defer();
var bootstrapStaticUrl = "https://fantasy.premierleague.com/drf/bootstrap-static";
var dreamTeamUrl = "https://fantasy.premierleague.com/drf/dream-team/";
var entryUrl = "https://fantasy.premierleague.com/drf/entry/"
var elementUrl = "https://fantasy.premierleague.com/drf/elements/"
var playersIconesUrl = "https://platform-static-files.s3.amazonaws.com/premierleague/photos/players/110x140/p"

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

// get Premeir league details if teamId is not specified, otherwise fetehs all teams details
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
    var newJson = {}, eventA, eventB;
    rp(options).then(function (response) {
        newJson.playerId = teamId;
        var maxGameweekPoints = Math.max.apply(Math, response.history.map(function (o) {
            return o.points;
        }));
        var maxBenchedPoints = Math.max.apply(Math, response.history.map(function (o) {
            return o.points_on_bench;
        }));
        response.history.forEach(function (e, i) {
            if (e.points === maxGameweekPoints) {
                eventA = i + 1;
            } else if (e.points_on_bench === maxBenchedPoints) {
                eventB = i + 1;
            }
        })
        newJson.data = {
            maxGameweekPoints: {value: maxGameweekPoints, event: eventA},
            maxBenchedPoints: {value: maxBenchedPoints, event: eventB},
        };
        deferred.resolve(newJson)
    }, function (error) {
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
}

exports.getTeamBestandWorstOverallRank = function (teamId) {
    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
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

exports.getTotalTransfersCost = function (teamId) {
    var options = {uri: "https://fantasy.premierleague.com/drf/entry/" + teamId + "/history", json: true};
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
        console.log('error doing HTTP request to ' + options.uri);
        deferred.reject(error);
        console.log(error)
    })
    return deferred.promise;
};

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

// ******************************************************************************************************************************** //

// *************************************************** To Do ********************************************************************** // 
// 
//exports.TwoTeamsH2H = function (teamId1, teamId2) {}
//
//exports.UsedChipsPoints = function (teamId) {}
//
// exports.changeTeamName = function (newName, MAIL , PASSWORD) {}
// 
// ..... Other utilities requiring login
// 
// ******************************************************************************************************************************** //





