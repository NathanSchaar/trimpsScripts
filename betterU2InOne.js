// ==UserScript==
// @name         BetterU2
// @version      0.1
// @namespace    https://github.com/NathanSchaar/trimpsScripts/blob/main
// @updateURL    https://github.com/NathanSchaar/trimpsScripts/blob/main/userScript.js
// @description  small u2 lategame improvements
// @author       Sagolel
// @include      *trimps.github.io*
// @connect      *trimps.github.io*
// @connect      self
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*
var script = document.createElement('script');
script.id = 'BetterU2-Sago';
script.src = 'https://github.com/NathanSchaar/trimpsScripts/blob/main/betterU2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossOrigin',"anonymous");
document.head.appendChild(script);
*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*var battlesLostBefore = game.stats.battlesLost.value
var battlesWonBefore = game.stats.battlesWon.value+1e6
async function antiEnrage() {
	//if (game.global.lastClearedCell <= 1)
	//	return;
	if (game.global.mapsActive) {
		if (game.stats.battlesWon.value > battlesWonBefore){
            while (game.global.mapsActive || game.global.preMapsActive){
                mapsClicked();
                await sleep(25);
            }
			battlesLostBefore = game.stats.battlesLost.value
		}
	} else {
		if (game.stats.battlesLost.value > battlesLostBefore+2){
			mapsClicked();
            await sleep(25);
            if (!game.global.preMapsActive) {
                mapsClicked();
                await sleep(25);
            }
			var currMapId = game.global.currentMapId;
			var mapId = game.global.lookingAtMap;
			var map = game.global.mapsOwnedArray[getMapIndex(mapId)];
			if (!map || map.level > game.global.world-20){
				if (currMapId !== ""){
					recycleMap();
				}
				selectAdvMapsPreset(3);
                buyMap();
			}
			battlesWonBefore = game.stats.battlesWon.value
			runMap();
		}
	}
} */

var clearingStacks = false;
async function antiEnrageBetter(){
	if (!game.global.challengeActive == "Daily" || !(typeof game.global.dailyChallenge.bloodthirst !== 'undefined')){
		return;
	}
	if (game.global.mapsActive && clearingStacks) {
		if (game.global.dailyChallenge.bloodthirst.stacks == 0){
			clearingStacks = false;
            while (game.global.mapsActive || game.global.preMapsActive){
                mapsClicked();
                await sleep(25);
            }
		}
	} else {
		if (game.global.dailyChallenge.bloodthirst.stacks >= dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength)-1){
			mapsClicked();
            await sleep(25);
            if (!game.global.preMapsActive) {
                mapsClicked();
                await sleep(25);
            }
			var currMapId = game.global.currentMapId;
			var mapId = game.global.lookingAtMap;
			var map = game.global.mapsOwnedArray[getMapIndex(mapId)];
			if (!map || map.level > game.global.world-20){
				if (currMapId !== ""){
					recycleMap();
				}
				selectAdvMapsPreset(3);
                sleep (10);
                buyMap();
                sleep (10);
			}
			clearingStacks = true;
			runMap();
		}
	}
}

async function heliumFarm(wind=false) {
	if (game.global.universe != 1){
		return;
	}
	var worldLevel = game.global.world
	if (worldLevel < 2) fightManual();
	if (worldLevel < 71) return;
	if (worldLevel < 809 && game.global.formation != 2){
		setFormation("2");
		return;
	}
	if (worldLevel > 809 && game.global.formation != 4){
		setFormation("4");
	}
	if (worldLevel > 800 && game.global.totalVoidMaps == 0){
		// portal
		portalClicked();
		sleep(30);
		numTab(6,true);
		sleep(10);
		buyPortalUpgrade('Looting_II');
		sleep(10);
		activateClicked();
		sleep(10);
		activatePortal();
		sleep(50);
		while (game.global.goldenUpgrades < 8){
			buyGoldenUpgrade('Void');
			sleep(20);
		}
		fightManual();
	}

}



game.global.addonUser = true;
setInterval(heliumFarm, 2000);
setInterval(antiEnrageBetter, 200);
