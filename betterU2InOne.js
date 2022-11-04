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
"use strict";
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function heliumFarm(wind=false) {
	if (game.global.universe != 1){
		return;
	}
	let worldLevel = game.global.world
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
		heliumFarm();
	}

}

var clearingStacks = false;
function antiEnrageBetter(){
	if (!game.global.challengeActive == "Daily" || !(typeof game.global.dailyChallenge.bloodthirst !== 'undefined')){
		return;
	}
	if (game.global.mapsActive) {
		if (!clearingStacks) return;
		let mapId = game.global.lookingAtMap;
		let map = game.global.mapsOwnedArray[getMapIndex(mapId)];
		if (map.location == "Void") return;
		if (game.global.dailyChallenge.bloodthirst.stacks == 0){
			clearingStacks = false;
            while (game.global.mapsActive || game.global.preMapsActive){
                mapsClicked();
                //await sleep(15);
            }
		}
	} else {
		let stacks = game.global.dailyChallenge.bloodthirst.stacks;
		let freq = dailyModifiers.bloodthirst.getFreq(game.global.dailyChallenge.bloodthirst.strength);
		if (stacks == freq-1 || (stacks>0 && stacks == freq-2)){
            while (!game.global.preMapsActive) {
                mapsClicked();
                //await sleep(15);
            }
			let currMapId = game.global.currentMapId;
			let mapId = game.global.lookingAtMap;
			let map = game.global.mapsOwnedArray[getMapIndex(mapId)];
			if (!map || map.level > game.global.world-20){
				if (currMapId !== ""){
					recycleMap();
				}
				selectAdvMapsPreset(3);
                //sleep (10);
                buyMap();
                //sleep (10);
			}
			clearingStacks = true;
			runMap();
		} else clearingStacks = false;
	}
}


function rawAttack(atk,equality){
	return atk / (0.9**equality);
}
function neededEquality(rawAttack, desiredAttack){
	return Math.ceil(Math.log(desiredAttack/rawAttack) / Math.log(0.9));
}
var strongestEnemy = {
	atk : 0,
	zoneSeen : 0
}
var adjustingForCurrentEnemy = false;

async function antiEmpower(){
	/*
	plan: avoid death in overworld by all(?) cost
		-> equality should never be so low that we get 1 shot, if possible not 2shot either
			possibility 1:
				keep track of highest atk ever seen so far, (if not on last zone, then multiply by 2.5 for every zone before)
			possibility 2:
				keep track of high atk of non mutated trimp in zone before, apply multiplier for worst possible enemy to get attack
				adjust equality based on what imp is next (and current) 
		keep equality always above point that would make highest atk at least a 2shot
		if currentTrimpHealth < enemyMaxAtk at any point: quit to map chamber, adjust equality
	we could use return to mapChamber to avoid problems and overlaps with other future functionality
	*/
	if (!game.global.challengeActive == "Daily" || !(typeof game.global.dailyChallenge.empower !== 'undefined')){
		return;
	}
	if (game.portal.Equality.scalingActive){
		toggleEqualityScale();
	}

	if (game.global.mapsActive){
		if (game.options.menu.exitTo.enabled) toggleSetting('exitTo', null, false, true);
		let mapId = game.global.lookingAtMap;
		let map = game.global.mapsOwnedArray[getMapIndex(mapId)];
		if (game.global.world == map.level){
	        cellNum = game.global.lastClearedMapCell + 1;
	        cell = game.global.mapGridArray[cellNum];
			if (game.badGuys[cell.name].fast){
				atk = calculateDamage(cell.attack, false, false, false, cell);
				atk = max(atk,calculateDamage(cell.attack, false, false, false, cell));
				atk = max(atk,calculateDamage(cell.attack, false, false, false, cell));
				shield = game.global.soldierEnergyShieldMax;
				let calcedEquality = min(game.portal.Equality.radLevel,max(0,neededEquality(rawAttack(atk),shield/4)));
				let slider = {id:"equalityDisabledSlider", val:calcedEquality};
				scaleEqualityScale(slider);
			} else {
				let slider = {id:"equalityDisabledSlider", val:0};
				scaleEqualityScale(slider);
			}
		}
	} // not sure which exitTo is on and off
	else if (game.global.preMapsActive && !adjustingForCurrentEnemy){
		// set equality to safe value based on known facts (strongest enemy), then return to world
	}
	else if (true){//trimps shield < enemyMax atk) {
		// exit to map chamber, adjust equality, possibly update strongest enemy
	}

}

function autoEquality(){
		let cell = null;
		if (game.global.mapsActive) {
			let cellNum = game.global.lastClearedMapCell + 1;
			cell = game.global.mapGridArray[cellNum];
		} else {
			let cellNum = game.global.lastClearedCell + 1;
			cell = game.global.gridArray[cellNum];
		}
		if (game.badGuys[cell.name].fast || (cell.u2Mutation && cell.u2Mutation.length) || game.global.voidBuff == "doubleAttack"){
			let atk = calculateDamage(cell.attack, false, false, false, cell);
			atk = Math.max(atk,calculateDamage(cell.attack, false, false, false, cell));
			atk = Math.max(atk,calculateDamage(cell.attack, false, false, false, cell));
			atk = Math.max(atk,calculateDamage(cell.attack, false, false, false, cell));
			atk = Math.max(atk,calculateDamage(cell.attack, false, false, false, cell));
			let shield = game.global.soldierEnergyShieldMax*3;
			let equality = game.portal.Equality.getActiveLevels();
			let rawAtk = rawAttack(atk,equality);
			if (game.global.challengeActive == "Daily" && (typeof game.global.dailyChallenge.mirrored !== 'undefined')){
				let dailyReflect = game.global.dailyChallenge.mirrored.strength
				if (dailyReflect > 55 || (typeof game.global.dailyChallenge.crits !== 'undefined' && dailyReflect+game.global.dailyChallenge.crits.strength>55)) shield*=4;
			}
			let calcedEquality = neededEquality(rawAtk,shield/4);
			console.log("atk: ",atk, "rawAtk: ", rawAtk, " shield: ",shield, "calcedEquality: ", calcedEquality);
			calcedEquality = Math.min(game.portal.Equality.radLevel,Math.max(0,calcedEquality));
			let slider = {id:"equalityDisabledSlider", value:calcedEquality};
			scaleEqualityScale(slider);
		} else {
			let slider = {id:"equalityDisabledSlider", value:0};
			scaleEqualityScale(slider);
		}
}


game.global.addonUser = true;
//setInterval(heliumFarm, 2000);
setInterval(antiEnrageBetter, 100);
setInterval(autoEquality, 300);
