// ==UserScript==
// @name         BetterU2
// @version      0.1
// @namespace    
// @updateURL    
// @description  small u2 lategame improvements
// @author       Sagolel
// @include      *trimps.github.io*
// @connect      *trimps.github.io*
// @connect      self
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

var script = document.createElement('script');
script.id = 'BetterU2-Sago';
//This can be edited to point to your own Github Repository URL.
//script.src = 'https://Zorn192.github.io/AutoTrimps/AutoTrimps2.js';
script.src = 'https://github.com/NathanSchaar/trimpsScripts/betterU2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);