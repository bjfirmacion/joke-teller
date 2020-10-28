const button = document.getElementById('button');
const audioElement = document.getElementById('audio');
const loader = document.getElementById('loader');
const playing = document.getElementById('playing');

// Hide loader and playing icons
loader.hidden = true;
playing.hidden = true;

// VoiceRSS Javascript SDK
const VoiceRSS={speech:function(e){this._validate(e),this._request(e)},_validate:function(e){if(!e)throw"The settings are undefined";if(!e.key)throw"The API key is undefined";if(!e.src)throw"The text is undefined";if(!e.hl)throw"The language is undefined";if(e.c&&"auto"!=e.c.toLowerCase()){var a=!1;switch(e.c.toLowerCase()){case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");break;case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");break;case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");break;case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");break;case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")}if(!a)throw"The browser does not support the audio codec "+e.c}},_request:function(e){var a=this._buildRequest(e),t=this._getXHR();t.onreadystatechange=function(){if(4==t.readyState&&200==t.status){if(0==t.responseText.indexOf("ERROR"))throw t.responseText;audioElement.src=t.responseText,audioElement.play()}},t.open("POST","https://api.voicerss.org/",!0),t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),t.send(a)},_buildRequest:function(e){var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"},_detectCodec:function(){var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""},_getXHR:function(){try{return new XMLHttpRequest}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}throw"The browser does not support HTTP request"}};

// Speech API as a function named "say"
function say(joke) {
  VoiceRSS.speech({
    key: '7487c40724834e37b2a9688c134a7993',
    src: joke,
    hl: 'en-us',
    v: 'Linda',
    r: 0, 
    c: 'mp3',
    f: '44khz_16bit_stereo',
    ssml: false
});
}

// Get Jokes from Joke API
async function getJoke() {
  let joke = '';
  const apiURL = 'https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist';
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    if (data.type === 'single') {
      joke = data.joke;
    } else {
      joke = `${data.setup} ... ${data.delivery}`
    }
  } catch (error) {
    throw new Error(`Failed to fetch error: ${error}`);
  }
  return joke;
}

// Async function that calls getJoke and passes the joke onto the say function
async function tellJoke() {
  const joke = await getJoke();
  say(joke);
}

// Loading and playing and end functions
function loading() {
  button.hidden = true;
  loader.hidden = false;
}

function play() {
  button.disabled = true;
  loader.hidden = true;
  button.hidden = false;
}


// Button event listener
button.addEventListener('click', () => {
  tellJoke();
  loading();
});

// Audio event listeners
audioElement.addEventListener('playing', () => {
  play();
});

audioElement.addEventListener('ended', () => {
  button.disabled = false;
});
