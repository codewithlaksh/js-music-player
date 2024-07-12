const songs = [
    { songName: 'Clarx - Zig Zag', songSrc: 'musics/Clarx - Zig Zag [NCS Release].mp3' },
    { songName: 'Janji - Heroes Tonight (feat. Johnning)', songSrc: 'musics/Janji - Heroes Tonight (feat. Johnning) [NCS Release].mp3' },
    { songName: 'Jarico - Island', songSrc: 'musics/Jarico - Island [NCS BEST OF].mp3' },
    { songName: 'Jarico - Landscape', songSrc: 'musics/Jarico - Landscape [NCS BEST OF].mp3' },
    { songName: 'Jarico - Paradise', songSrc: 'musics/Jarico - Paradise [NCS BEST OF].mp3' },
    { songName: 'Jarico - Taj Mahal', songSrc: 'musics/Jarico - Taj Mahal [NCS BEST OF].mp3' },
    { songName: 'Jarico - Waves', songSrc: 'musics/Jarico - Waves [NCS BEST OF].mp3' }
];
const playBtn = document.querySelector('img#playBtn');
const nextBtn = document.querySelector('img#nextBtn');
const prevBtn = document.querySelector('img#prevBtn');
const repeatBtn = document.querySelector('img#repeatBtn');
let songNameEl = document.querySelector('h1.songName');
let songsList = document.querySelector('ul.songsList');
let seekbar = document.querySelector('div.seekbar');
let circle = seekbar.querySelector('span.circle');
let index = 0;
let audio = new Audio(songs[index].songSrc);
songNameEl.innerText = songs[index].songName;

async function getAudioDuration(src) {
    return new Promise((resolve, err) => {
        let i = new Audio();
        i.src = src;

        i.addEventListener('loadedmetadata', () => {
            resolve(i.duration);
        })
        i.addEventListener('error', (err) => {
            reject(err);
        });
    })
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let str = "";
    for (let song of songs) {
        const duration = await getAudioDuration(song.songSrc);
        str += `<li class="songItem">
        <p>${song.songName}</p>
        <p>${secondsToMinutesSeconds(duration)}</p>
        </li>`
    }

    songsList.innerHTML = str;
    document.querySelectorAll('li.songItem')[index].style.background = 'dodgerblue';
    document.querySelectorAll('li.songItem')[index].style.color = 'white';

    Array.from(document.querySelectorAll('li.songItem')).forEach((element, i) => {
        element.addEventListener('click', (e) => {
            audio.pause();
            audio.currentTime = 0;
            index = i;
            songNameEl.innerText = songs[i].songName;
            audio.src = songs[i].songSrc;
            playMusic();
            changeBg(i);
        })
    })
}

getSongs();

const changeBg = (index) => {
    let arr = Array.from(document.querySelectorAll('li.songItem'));

    for (let i = 0; i < arr.length; i++) {
        if (i === index) {
            arr[i].style.background = 'dodgerblue';
            arr[i].style.color = 'white';
        } else {
            arr[i].style.background = 'white';
            arr[i].style.color = 'black';
        }
    }
}

seekbar.addEventListener('click', (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    circle.style.left = percent + '%';

    if (((audio.duration * percent) / 100) === audio.duration) {
        audio.pause();
        audio.currentTime = 0;
        circle.style.left = '0';
        playBtn.src = 'images/play.svg';
    } else {
        audio.currentTime = (audio.duration * percent) / 100;
    }

})

audio.addEventListener('ended', () => {
    audio.pause();
    audio.currentTime = 0;
    circle.style.left = '0';
    playBtn.src = 'images/play.svg';
})

const playMusic = () => {
    songNameEl.innerText = songs[index].songName;
    if (audio.paused) {
        audio.play();
        playBtn.src = 'images/pause.svg';
    } else {
        audio.pause();
        playBtn.src = 'images/play.svg';

    }
    audio.addEventListener('timeupdate', () => {
        circle.style.left = ((audio.currentTime / audio.duration) * 100) + '%';
    })
}

playBtn.addEventListener('click', (e) => {
    playMusic();
})

nextBtn.addEventListener('click', (e) => {
    audio.pause();
    audio.currentTime = 0;
    circle.style.left = '0';
    if (index === songs.length - 1) {
        index = 0;
    } else {
        index += 1;
    }
    audio.src = songs[index].songSrc;
    playMusic();
    changeBg(index);
})

prevBtn.addEventListener('click', (e) => {
    audio.pause();
    audio.currentTime = 0;
    circle.style.left = '0';
    if (index === 0) {
        index = songs.length - 1;
    } else {
        index -= 1;
    }
    audio.src = songs[index].songSrc;
    playMusic();
    changeBg(index);
})

repeatBtn.addEventListener('click', (e) => {
    if (!audio.loop) {
        audio.loop = true;
        e.target.src = 'images/repeat-one.svg';
    } else {
        audio.loop = false;
        e.target.src = 'images/repeat.svg';
    }
})
