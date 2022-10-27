// set equality

/*
first test script:
	count deaths, after 3 deaths, quit into maps, create map setting 3 map, run it, defeat 1 enemy and go back in overworld
*/

var battlesLostBefore = game.stats.battlesLost.value
var battlesWonBefore = game.stats.battlesWon.value
var runInterval = 200;

function delayStartAgain() {
    game.global.addonUser = true;
    game.global.autotrimps = true;
    setInterval(mainLoop, runInterval);
}

function mainLoop() {
	if (game.global.lastClearedCell <= 1)
		return; 

	if (game.global.mapsActive) {
		if (game.stats.battlesWon.value > battlesWonBefore){
			mapsClicked();
			sleep(15);
			mapsClicked();
			sleep(15);
			mapsClicked();
			battlesLostBefore = game.stats.battlesLost.value
		}
	} else {
		if (game.stats.battlesLost.value > battlesLostBefore+2){
			mapsClicked();
			sleep(15);
			var currMapId = game.global.currentMapId;
			var mapId = game.global.lookingAtMap;
			var map = game.global.mapsOwnedArray[getMapIndex(mapId)];
			if (map.level > game.global.world-20){
				if (currMapId !== ""){
					recycleMap();
				}
				selectAdvMapsPreset(3);
			}
			battlesWonBefore = game.stats.battlesWon.value
			runMap();
		}
	}

}
