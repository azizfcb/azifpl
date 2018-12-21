# azifpl
A wrapper around the Fantasy Premier League Platform, implementing multiple functionnalities from getting gameweek score, to players prices, changing teams names, leagues history, set captain and more ⚽ ⚽

## Getting Started

These instructions will get you wokring with this package and integrate it in your code.

### Prerequisites

Prior to use this module, you only need a working Node js installation, and yes of course, an internet connexion 😄

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
All you need next is to require the module in your code using:

```
var azifpl = require('azifpl');
```
and call its functions in your code.

**Example 1
Get the worst and the best overall rank of a fantasy team:**
```
azifpl.getTeamBestandWorstOverallRank(455312).then(function (res) {
    console.log(res)
}, function (err) {
    console.log(err)
})
```
Output:
```
{ playerId: 455312,
  data: 
   { bestOverAllRank: { Value: 36605, eventNumber: 5 },
     worstOverAllRank: { Value: 1857687, eventNumber: 1 } } }
```

**Example 2:
get used chips scores/Gameweek activation:**

```
azifpl.chipsPoints(455312).then(function (res) {
    console.log(res)
}, function (err) {
    console.log(err)
})
```
Output:
```
[ { chips: 'wildcard', event: 9, points: 25 },
  { chips: 'freehit', event: 19, points: 78 } ]
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
