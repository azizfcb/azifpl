# azifpl
A wrapper around the Fantasy Premier League Platform, implementing multiple functionnalities from getting gameweek score, to players prices, changing teams names, leagues history, set captain and more ⚽ ⚽

## Getting Started

These instructions will get you wokring with this package and integrate it in your code.

### Prerequisites

Prior to use this module, you only need a working Node installation.

### Installing

Add the dependency to your package.json file:

```
...
"dependencies": {
    ...
    "azifpl": "latest",
    ...
...
```

And then install it using:

```
npm install
```

you can do add the module to your package.json and install it running a single command:
```
npm install azifpl --save
```
All you need next is to require the module in your code using, and call its functions:

```
var azifpl = require('azifpl');

// get my worst and best overall rank
azifpl.getTeamBestandWorstOverallRank(455312).then(function (res) {
    console.log(res)
}, function (err) {
    console.log(err)
})

// get Event Dream Team
azifpl.getEventDreamTeam(1).then(function (res) {
    console.log(res)
}, function (err) {
    console.log(err)
})

// get A classic League Top 10
azifpl.getLeagueTopTenPlayers(238).then(function (res) {
    console.log(res)
}, function (err) {
    console.log(err)
})
```

Take a look at index.js to see what are the available methods.

## To Do ( In no particular order ) :
* Compare two fantasy teams against each others => Done
* Chips used and corresponding event/points => Done
* Changing a team name ( Using Login mail and Password )
* transfer and replace player ( Using Login mail and Password )
* set Captain/Vice Captain (C/VC) ( Using Login mail and Password )

and many more! stay tunned! 👀

## Authors

* **Abdelaziz Dabebi** - [azizfcb](https://github.com/azizfcb)
