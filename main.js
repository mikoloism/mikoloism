// thanks : https://github.com/yek-org/yek-js & https://www.npmjs.com/package/jsmediatags & https://mp3tag.js.org
// NOTE [play/pause]
const $_player = query('#music-player');
const $_file = query('#file-audio');
const $_play = query('#music-play');
const $_forward = query('#music-forward');
const $_backward = query('#music-backward');
const $_seek = query('#music-seek');
const $_duration = query('#music-duration');
const $_currentTime = query('#music-current-time');
const $_cover = query('#music-cover');
const $_trackName = query('#music-title');
const $_artist = query('#music-desc');
const $audio = query('#music-audio');
const defaultTrack = {
  // id: (() => trackList.slice(-1).id + 1)(),
  cover: `https://www.iphonefaq.org/files/styles/large/public/apple_music.jpg?itok=nqYGxWgh`,
  title: `Unknown`,
  artist: `unknown`,
};
const fixPath = `https://raw.githubusercontent.com/miko-github/miko-github/gh_assets/assets/sounds`;
// TODO : use online src link
// NOTE : artist can be array of artist [a, b, ...] also
let trackList = [
  {
    id: 0,
    title: `Arayeshe Ghaliz`,
    src: `${fixPath}/Homayoun%20Shajarian%20-%20Arayeshe%20Ghaliz.mp3`,
    artist: `Homayoun Shajarian`,
    cover: undefined,
  },
  {
    id: 1,
    title: `Norouz`,
    src: `${fixPath}/Homayoun%20Shajarian%20&%20Sohrab%20Pournazeri%20-%20Norouz.mp3`,
    artist: `Homayoun Shajarian`,
    cover: undefined,
  },
  {
    id: 2,
    title: `Shole Var`,
    src: `${fixPath}/Homayoun_shajarian_SholehVar_Final.mp3`,
    artist: `Homayoun Shajarian`,
    cover: undefined,
  },
  {
    id: 3,
    title: `Saghi Bia`,
    src: `${fixPath}/MohammadReza%20Shajaryan%20-%20Saghi%20Bia.mp3`,
    artist: `Mohammad Reza Shajarian`,
    cover: undefined,
  },
  {
    id: 4,
    title: `Rap God`,
    src: `${fixPath}/Eminem%20-%20Rap%20God.mp3`,
    artist: `Eminem`,
    cover: undefined,
  },
  {
    id: 5,
    title: `Bande Naaf`,
    src: `${fixPath}/yas-bande-naaf-ta-khatte-saaf-ft-moer.mp3`,
    artist: `Yas`,
    cover: undefined,
  },
  {
    id: 6,
    title: `Halal Osoun`,
    src: `${fixPath}/ali_ardavan%20&%20sohrab%20mj_halal_osoun.mp3`,
    artist: [`Ali Ardavan`, `Sohrab MJ`],
    cover: undefined,
  },
  {
    id: 7,
    title: `Sobhoone`,
    src: `${fixPath}/Ho3ein%20-%20Sobhoone.mp3`,
    artist: `Ho3ein`,
    cover: undefined,
  },
  {
    id: 8,
    title: `Makhlase Kaloom`,
    src: `${fixPath}/Shayea%20-%20Makhlase%20Kaloom.mp3`,
    artist: `Shayea`,
    cover: undefined,
  },
  {
    id: 9,
    title: `Tukur Tukur`,
    src: `${fixPath}/Tukur%20Tukur%20-%20Arijit%20Singh.mp3`,
    artist: undefined,
    cover: undefined,
  },
  {
    id: 10,
    title: `Tharki Chokro`,
    src: `${fixPath}/01%20-%20Tharki%20Chokro.mp3`,
    artist: undefined,
    cover: undefined,
  },
  {
    id: 11,
    title: `Vilayati Sharaab`,
    src: `${fixPath}/Vilayati.Sharaab.mp3`,
    artist: [`Darshan Raval`, `Neeti Mohan`],
    cover: undefined,
  },
];

function fixArtist(artist) {
  if (isType(artist, 'array')) return artist.join(' & ');
  return artist;
}
function goForward() {
  let currentTrack = selectCurrentTrack();
  if (currentTrack.id + 1 > trackList.length - 1)
    changeMetaData(trackList[0].src);
  else changeMetaData(trackList[currentTrack.id + 1].src);
  $audio.play();
}
function goBackward() {
  let currentTrack = selectCurrentTrack();
  if (currentTrack.id - 1 < 0)
    changeMetaData(trackList[trackList.length - 1].src);
  else changeMetaData(trackList[currentTrack.id - 1].src);
  $audio.play();
}
function selectCurrentTrack() {
  return trackList.filter((track) => track.src == $audio.src)[0];
}
function changeMetaData(src) {
  let currentTrack = selectCurrentTrack();
  $_trackName.textContent =
    (currentTrack && currentTrack.title) || defaultTrack.title;
  $_artist.textContent =
    fixArtist(currentTrack && currentTrack.artist) || defaultTrack.artist;
  $_cover.setAttribute(
    'src',
    (currentTrack && currentTrack.cover) || defaultTrack.cover
  );
  src && $audio.setAttribute('src', src);
}

// +++ Event Handler +++ //
// FIXME
listener($audio, 'durationchange', () => {
  let currentTrack = selectCurrentTrack();
  // fixBase64(currentTrack.src, (file) => {
  //   fetchMetadata(file, (tags) => {
  //     trackList.splice(currentTrack.id - 1, 1, {
  //       id: (() => trackList[trackList.length - 1].id + 1)(),
  //       src: currentTrack.src,
  //       title: tags.title,
  //       artist: tags.artist,
  //       cover: tags.APIC && fetchCover(tags.APIC)
  //     });
  //   });
  // });
  // // fixBase64(currentTrack.src, (file) => {
  // // metadata(currentTrack.src, ({ tags }) => {
  // // });
  // // });
});

// [file]:change
listener($_file, 'change', () => {
  $audio.pause();
  [...Array($_file.files.length).keys()].forEach((index) => {
    let file = $_file.files[index];
    let src = URL.createObjectURL(file);
    fetchMetadata(file, (tags) => {
      let track = {
        id: (() => trackList[trackList.length - 1].id + 1)(),
        title: tags.title,
        cover: tags.picture && fetchCover(tags.picture),
        artist: tags.artist,
        src,
      };
      trackList.push(track);
    });
    changeMetaData(src);
  });
  $audio.play();
});

// ALT
/*
listener($_file, 'change', () => {
  $audio.pause();
  [...Array($_file.files.length).keys()].forEach((index) => {
    let file = $_file.files[index];
    let src = URL.createObjectURL(file);
    fetchMetadata2(file, (tags) => {
      let track = {
        id: (() => trackList[trackList.length - 1].id + 1)(),
        title: tags.title,
        cover: tags.v2.APIC[0] && fetchCover(tags.v2.APIC[0]),
        artist: tags.v2.TPE1,
        src,
      };
      trackList.push(track);
    });
    changeMetaData(src);
  });
  $audio.play();
});
*/

// [file]:drag/drop
window.ondragenter = (e) => {
  $audio.pause();
  $_file.classList.add('music__uploader--show');
  $_player.classList.add('music--upload');
};
$_player.ondrop = () => {
  $audio.play();
  $_file.classList.remove('music__uploader--show');
  $_player.classList.remove('music--upload');
};

// [audio]:play
listener($audio, 'playing', () => changeMetaData());

// [audio]:canplaythrough

listener(
  $audio,
  'durationchange',
  () => ($_duration.textContent = fixMoment($audio.duration))
);

// [audio]:time-update
listener(
  $audio,
  'timeupdate',
  () => ($_currentTime.textContent = fixMoment($audio.currentTime))
);

// [auido]:time-update
listener($audio, 'timeupdate', () => {
  let percentage = fixPercentage(
    parseFloat($audio.currentTime),
    parseFloat($audio.duration)
  );
  fixVariable('seek_listener_percentage', `${percentage}%`);
});

// [seek]:seeked
listener($_seek, 'mousedown', () => $audio.pause());
listener($_seek, 'mouseup', () => $audio.play());
listener($_seek, 'click', (ev) => {
  let { offsetX: value } = ev;
  let { offsetWidth: max } = $_seek;
  // calc motion
  let percentage = fixPercentage(value, max);
  // TOGGLE
  fixVariable('--seek_listener_percentage', `${percentage}%`);
  // calc value
  let amount = fixFloat((percentage / 100) * parseFloat($audio.duration), 3);
  $audio.currentTime = amount;
});

// [backward]:click
listener($_backward, 'click', () => goBackward());

// [forward]:click
listener($_forward, 'click', () => goForward());

// NOTE : when sound finished, then, play next music
listener($audio, 'ended', () => goForward());

// [play]:click
listener($_play, 'click', () =>
  $audio.paused ? $audio.play() : $audio.pause()
);

// [audio]:play
listener($audio, 'play', () => {
  $_play.setAttribute('title', 'play');
  $_play.classList.replace(`music__btn--pause`, `music__btn--play`);
  $_play.children.item(0).classList.replace('fa-play', 'fa-pause');
});

// [audio]:pause
listener($audio, 'pause', () => {
  $_play.setAttribute('title', 'pause');
  $_play.classList.replace(`music__btn--play`, `music__btn--pause`);
  $_play.children.item(0).classList.replace('fa-pause', 'fa-play');
});

// -----------------------

// NOTE : src from `https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js`
function fetchMetadata(audio, cb) {
  jsmediatags.read(audio, {
    onSuccess: ({ tags }) => cb(tags),
    onError: function (error) {
      console.log(error);
    },
  });
}

// FIXME : need to sync with other codes
// NOTE : src from `https://cdn.jsdelivr.net/npm/mp3tag.js@latest/dist/mp3tag.min.js`
function fetchMetadata2(url, cb) {
  const reader = new FileReader();
  reader.onload = function () {
    const buffer = this.result;
    // MP3Tag Usage
    const mp3tag = new MP3Tag(buffer);
    mp3tag.read();
    cb(mp3tag.tags);
  };
  reader.readAsArrayBuffer(url);
}

function fetchCover({ data, format }) {
  let base64String = '';
  for (let item of data) {
    base64String += String.fromCharCode(item);
  }
  return `data:${data.format};base64,${window.btoa(base64String)}`;
}

function fixFloat(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

function fixPad(number) {
  let num = parseInt(number);
  return num >= 0 && num <= 9 ? `0${num}` : num;
}

function fixPercentage(value, total) {
  return fixFloat((value / total) * 100, 3);
}

function fixMoment(time) {
  let $time = moment.duration(parseInt(time), 'seconds');
  let hour = $time.hours();
  let min = $time.minutes();
  let sec = $time.seconds();
  let _hour = hour > 0 ? `${fixPad(hour)} : ` : ``;
  let _min_sec = `${fixPad(min)} : ${fixPad(sec)}`;
  return `${_hour}${_min_sec}`;
}

function fixVariable(variable, value) {
  document.documentElement.style.setProperty(`--${variable}`, value);
}

// FIXME : need to use new methods
function fixBase64(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = `blob` || 'arraybuffer';
  xhr.onload = function () {
    // NOTE : metadata as callback, response is `arrayBuffer`
    if (xhr.status === 200) return cb(xhr.response);
    return console.log(`[fixBase64] : xhr error!`);
  };
  xhr.onerror = () => console.log(`[fixBase64] : network error!`);
  xhr.send();
}
