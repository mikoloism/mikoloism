// thanks : jsmediatags
// toggle [play/pause]
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
// TODO : rename to `trackList` or `playList`
// TODO : use online src link
// TODO : `id` start from 0
// NOTE : artist can be array of artist [a, b, ...] also
let MUSIC_LIST = [
  {
    id: 1,
    title: `Arayeshe Ghaliz`,
    src: `${fixPath}/Homayoun%20Shajarian%20-%20Arayeshe%20Ghaliz.mp3`,
    artist: `Homayoun Shajarian`,
    cover: undefined,
  },
  {
    id: 2,
    title: `Norouz`,
    src: `${fixPath}/Homayoun%20Shajarian%20&%20Sohrab%20Pournazeri%20-%20Norouz.mp3`,
    artist: `Homayoun Shajarian`,
    cover: undefined,
  },
  {
    id: 3,
    title: `Shole Var`,
    src: `${fixPath}/Homayoun_shajarian_SholehVar_Final.mp3`,
    artist: `Homayoun Shajarian`,
    cover: undefined,
  },
  {
    id: 4,
    title: `Saghi Bia`,
    src: `${fixPath}/MohammadReza%20Shajaryan%20-%20Saghi%20Bia.mp3`,
    artist: `Mohammad Reza Shajarian`,
    cover: undefined,
  },
  {
    id: 5,
    title: `Rap God`,
    src: `${fixPath}/Eminem%20-%20Rap%20God.mp3`,
    artist: `Eminem`,
    cover: undefined,
  },
  {
    id: 6,
    title: `Bande Naaf`,
    src: `${fixPath}/yas-bande-naaf-ta-khatte-saaf-ft-moer.mp3`,
    artist: `Yas`,
    cover: undefined,
  },
  {
    id: 7,
    title: `Halal Osoun`,
    src: `${fixPath}/ali_ardavan%20&%20sohrab%20mj_halal_osoun.mp3`,
    artist: [`Ali Ardavan`, `Sohrab MJ`],
    cover: undefined,
  },
  {
    id: 8,
    title: `Sobhoone`,
    src: `${fixPath}/Ho3ein%20-%20Sobhoone.mp3`,
    artist: `Ho3ein`,
    cover: undefined,
  },
  {
    id: 9,
    title: `Makhlase Kaloom`,
    src: `${fixPath}/Shayea%20-%20Makhlase%20Kaloom.mp3`,
    artist: `Shayea`,
    cover: undefined,
  },
  {
    id: 10,
    title: `Tukur Tukur`,
    src: `${fixPath}/Tukur%20Tukur%20-%20Arijit%20Singh.mp3`,
    artist: undefined,
    cover: undefined,
  },
  {
    id: 11,
    title: `Tharki Chokro`,
    src: `${fixPath}/01%20-%20Tharki%20Chokro.mp3`,
    artist: undefined,
    cover: undefined,
  },
  {
    id: 12,
    title: `Vilayati Sharaab`,
    src: `${fixPath}/Vilayati.Sharaab.mp3`,
    artist: [`Darshan Raval`, `Neeti Mohan`],
    cover: undefined,
  },
];

// TODO : make every thing with below class
class MusicPlayer {
  constructor(player, trackList = []) {
    this.trackList = trackList;
    this.player = player;
    this.current = 0;
    this.currentTrack = this.trackList[this.current];
  }
  play() {
    this.currentTrack = this.trackList[this.current];
    let { src } = this.currentTrack;
    this.player.setAttribute('src', src);
    this.player.play();
    return src;
  }
  pause() {
    this.player.pause();
  }
  forward() {
    if (this.current + 1 > this.trackList.length - 1) {
      this.current = 0;
    } else {
      this.current += 1;
    }
    this.play();
  }
  backward() {
    if (this.current - 1 < 0) {
      this.current = this.trackList.length - 1;
    } else {
      this.current -= 1;
    }
    this.play();
  }
  duration() {}
}

const $player = new MusicPlayer($audio, MUSIC_LIST);

// +++ Event Handler +++ //
function fixArtist(artist) {
  if (isType(artist, 'array')) return artist.join(' & ');
  return artist;
}
function goForward() {
  let currentTrack = selectCurrentTrack();
  if (currentTrack.id + 1 > MUSIC_LIST.length)
    changeMetaData(MUSIC_LIST[0].src);
  else changeMetaData(MUSIC_LIST[currentTrack.id].src);
  $audio.play();
}
function goBackward() {
  let currentTrack = selectCurrentTrack();
  if (currentTrack.id - 1 <= 0)
    changeMetaData(MUSIC_LIST[MUSIC_LIST.length - 1].src);
  else changeMetaData(MUSIC_LIST[currentTrack.id - 2].src);
  $audio.play();
}

function selectCurrentTrack() {
  return MUSIC_LIST.filter((track) => track.src == $audio.src)[0];
}
function changeMetaData(src) {
  let currentTrack = selectCurrentTrack() || $player.currentTrack;
  $_trackName.textContent = currentTrack.title || defaultTrack.title;
  $_artist.textContent = fixArtist(currentTrack.artist) || defaultTrack.artist;
  $_cover.setAttribute('src', currentTrack.cover || defaultTrack.cover);
  src && $audio.setAttribute('src', src);
}

listener($audio, 'durationchange', () => {
  let currentTrack = selectCurrentTrack();
  // fixBase64(currentTrack.src, (file) => {
  //   fetchMetadata(file, (tags) => {
  //     MUSIC_LIST.splice(currentTrack.id - 1, 1, {
  //       id: (() => MUSIC_LIST[MUSIC_LIST.length - 1].id + 1)(),
  //       src: currentTrack.src,
  //       title: tags.title,
  //       artist: tags.artist,
  //       cover: tags.APIC && fetchCover2(tags.APIC)
  //     });
  //   });
  // });
  // // fixBase64(currentTrack.src, (file) => {
  // // metadata(currentTrack.src, ({ tags }) => {
  // // });
  // // });
});

// [file]:change
listener($_file, 'change', function ({ target }) {
  $audio.pause();
  [...Array(target.files.length).keys()].forEach((index) => {
    let file = target.files[index];
    let src = URL.createObjectURL(file);
    metadata(file, ({ tags }) => {
      MUSIC_LIST.push({
        id: (() => MUSIC_LIST[MUSIC_LIST.length - 1].id + 1)(),
        title: tags.title,
        cover: tags.picture && fetchCover(tags.picture),
        artist: tags.artist,
        src,
      });
    });
    // ALT
    /**
    fetchMetadata(file, (tags) => {
      MUSIC_LIST.push({
        id: (() => MUSIC_LIST[MUSIC_LIST.length - 1].id + 1)(),
        title: tags.title,
        cover: tags.v2.APIC[0] && fetchCover2(tags.v2.APIC[0]),
        artist: tags.v2.TPE1,
        src
      });
    });
    */
    changeMetaData(src);
  });

  $audio.play();
});

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
function fixMoment(time) {
  let $time = moment.duration(time, 'seconds');
  let hour = $time.hours();
  let min = $time.minutes();
  let sec = $time.seconds();
  let _hour = hour > 0 ? `${fixPad(hour)} : ` : ``;
  let _min_sec = `${fixPad(min)} : ${fixPad(sec)}`;
  return `${_hour}${_min_sec}`;
}

listener(
  $audio,
  'durationchange',
  () => ($_duration.textContent = fixMoment(parseInt($audio.duration)))
);

// [audio]:time-update
listener(
  $audio,
  'timeupdate',
  () => ($_currentTime.textContent = fixMoment(parseInt($audio.currentTime)))
);

// [auido]:time-update
listener($audio, 'timeupdate', () => {
  let percentage = fixPercentage(
    parseFloat($audio.currentTime),
    parseFloat($audio.duration)
  );
  document.documentElement.style.setProperty(
    '--seek_listener_percentage',
    `${percentage}%`
  );
});

// [seek]:seeked
listener($_seek, 'mousedown', () => $audio.pause());
listener($_seek, 'mouseup', () => $audio.play());
listener($_seek, 'click', (ev) => {
  let { offsetX: value } = ev;
  let { offsetWidth: max } = $_seek;
  // calc motion
  let percentage = fixPercentage(value, max);
  document.documentElement.style.setProperty(
    '--seek_listener_percentage',
    `${percentage}%`
  );
  // calc value
  let amount = fixFloat((percentage / 100) * parseFloat($audio.duration), 3);
  $audio.currentTime = amount;
});

// [backward]:click
listener($_backward, 'click', () =>
  // ALT : $player.backward();
  goBackward()
);

// [forward]:click
listener($_forward, 'click', () =>
  // ALT : $player.forward();
  goForward()
);

// NOTE : when sound finished, then, play next music
listener($audio, 'ended', () =>
  // ALT : $player.forward();
  goForward()
);

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

// -
// -
// -
// -
// -
// -
// -----------------------

function metadata(audio, cb) {
  jsmediatags.read(audio, {
    onSuccess: cb,
    onError: function (error) {
      console.log(error);
    },
  });
}
function fetchMetadata(url, cb) {
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
  // TODO : for...of || for...in
  for (let i = 0; i < data.length; i++) {
    base64String += String.fromCharCode(data[i]);
  }
  return `data:${data.format};base64,${window.btoa(base64String)}`;
}
function fetchCover2({ data, format }) {
  let base64String = '';
  // TODO : for...of || for...in
  for (let i in data) {
    base64String += String.fromCharCode(data[i]);
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
