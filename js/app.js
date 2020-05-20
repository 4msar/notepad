(function(){function a(){return window.navigator.onLine}function b(a=!0){a&&!q()?v.style.removeProperty("display"):v.style.display="none"}function c(){var a=document.body.clientHeight,b=s.scrollHeight,c=t.scrollHeight;if(b>c){t.style.height=`${b+a/2}px`}else""===t.style.height&&(t.style.height=`${a}px`)}function d(){var a=w;A.has("note")&&(a=w+A.get("note"));var b=localStorage.getItem(a)||"";return b}function e(a){return a.startsWith("note-")?a:"note-"+a}function f(a){var b=i();return b.length>a.length&&b.length!==a.length&&confirm("You have a old note, do you want to load this?")?(j(A.get("note")),b):a}function g(){var a=f(d());s.value=a,c()}function h(a,b){return null===b&&(b="backup"),localStorage.setItem(x+b,a)}function i(){var a="backup";A.has("note")&&(a=A.get("note"));var b=localStorage.getItem(x+a)||"";return b}function j(a){return null===a&&(a="backup"),localStorage.removeItem(x+a)}function k(a){A.has("note")&&p(a,A.get("note"),function(){B=a})}function l(a){clearTimeout(z),z=setTimeout(function(){k(a)},5000);var b=w;return A.has("note")&&(b=w+A.get("note")),localStorage.setItem(b,a)}function m(a,b){return Math.floor(Math.random()*(b-a+1))+a}function n(a){var b=m(1,255);a?u.style.backgroundColor="hsl("+b+", 100%, 50%)":u.style.removeProperty("background-color")}function o(a,b=null){null===b&&(b=Math.random().toString(36).substr(5,15)),b.startsWith("note-")&&(b=b.replace("note-",""));var c={};return c["note-"+b]=a,c}function p(b,c,d){if(B===b)return!0;if(q())return!0;if(!a())return C&&(alert("No internet connection is available now."),h(b,c),C=!1),setTimeout(function(){C=!0},60000),!1;n(!0);var e=o(b,c);fetch(y+".json",{method:"PATCH",body:JSON.stringify(e)}).then(function(a){return n(!1),a.json()}).then(function(a){if(B=b,"function"==typeof d)return d(a,e)}).catch(function(a){console.log(a),console.log("Failed to sync data..."),h(b,c)})}function q(){return A.has("readonly")||A.has("msar")}function r(a){return!!q()||void fetch(y+"/"+e(a)+".json",{method:"DELETE"}).then(a=>a.json()).then(b=>{return localStorage.removeItem(w+a)})}const s=document.getElementById("editor"),t=document.getElementById("editor-container"),u=document.getElementById("save"),v=document.getElementById("delete"),w="__msar_note_app__",x="__msar_note_sync_",y="seton/moc.oiesaberif.em-rasm//:sptth".split("").reverse().join("");var z,A=new URLSearchParams(window.location.search),B="",C=!0;s.onkeyup=function(a){l(a.target.value),c()},s.onkeydown=function(){clearTimeout(z)},v.onclick=function(){var a=confirm("Do you really want to delete?");if(a&&A.has("note")){r(A.get("note")),b(!1);var c=new URL(location.origin+location.pathname);window.history.pushState("","Note",c),A=new URLSearchParams(window.location.search)}},u.onclick=function(){var a=d();if(!a)return alert("Write something..."),0;var c=p(a,A.get("note")||null,function(c,d){if(null!==c){var e=Object.keys(d)[0],f=new URL(location.origin+location.pathname);f.searchParams.append("note",e.replace("note-",""));var g=prompt("Here is your note link:",f.toString());clearTimeout(z),g&&(window.history.pushState("","Note",g),A=new URLSearchParams(window.location.search),b(!0),l(a))}});if(!0===c)prompt("Here is your note link:",window.location.href)},A.has("note")&&a()?(function(a,b){if(a.startsWith("note-")||(a="note-"+a),a)fetch(y+"/"+a+".json").then(function(a){return a.json()}).then(function(a){if("function"==typeof b)return b(a)});else if("function"==typeof b)return b(!1)}(A.get("note"),function(a){if(null!==a){B=a;var d=f(a);s.value=d,l(d),b(!0),c()}else g()}),q()&&(s.readOnly=!0,u.style.display="none",v.style.display="none")):g()})();