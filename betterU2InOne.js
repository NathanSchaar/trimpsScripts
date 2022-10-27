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

var battlesLostBefore = game.stats.battlesLost.value
var battlesWonBefore = game.stats.battlesWon.value+1e6
var runInterval = 200;

function delayStartAgain() {
    game.global.addonUser = true;
    game.global.autotrimps = true;
    setInterval(mainLoop, runInterval);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function mainLoop() {
	if (game.global.lastClearedCell <= 1)
		return;

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
}

delayStartAgain();
