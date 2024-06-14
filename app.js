let currentMusic = 0;

const music = document.querySelector('#audio');

const seekBar = document.querySelector('.seek-bar');
const songName = document.querySelector('.music-name');
const artist = document.querySelector('.artist-name');
const disk = document.querySelector('.disk');
const currentTime = document.querySelector('.current-time');
const musicDuration = document.querySelector('.song-duration');
const playBtn = document.querySelector('.play-btn');
const forwardBtn = document.querySelector('.forward-btn');
const backwardBtn = document.querySelector('.backward-btn');

playBtn.addEventListener('click', () => {
    if(playBtn.className.includes('pause')){
        music.play();
    } else{
        music.pause();
    }
    playBtn.classList.toggle('pause');
    disk.classList.toggle('play');
});

const setMusic = (i) => {
    seekBar.value = 0;
    let song = songs[i];
    currentMusic = i;
    music.src = song.path;

    songName.innerHTML = song.name;
    artist.innerHTML = song.artist;
    disk.style.backgroundImage = `url('${song.cover}')`;

    currentTime.innerHTML = '00:00';
    setTimeout(() => {
        seekBar.max = music.duration;
        musicDuration.innerHTML = formatTime(music.duration);
    }, 300);
};

setMusic(0);

const formatTime = (time) => {
    let min = Math.floor(time / 60);
    if(min < 10){
        min = `0${min}`;
    }
    let sec = Math.floor(time % 60);
    if(sec < 10){
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
};

setInterval(() => {
    seekBar.value = music.currentTime;
    currentTime.innerHTML = formatTime(music.currentTime);
}, 500);

seekBar.addEventListener('change', () => {
    music.currentTime = seekBar.value;
});

const playMusic = () => {
    music.play();
    playBtn.classList.remove('pause');
    disk.classList.add('play');
};

const playNextMusic = () => {
    if(currentMusic >= songs.length - 1){
        currentMusic = 0;
    } else{
        currentMusic++;
    }
    setMusic(currentMusic);
    playMusic();
};

forwardBtn.addEventListener('click', playNextMusic);

backwardBtn.addEventListener('click', () => {
    if(currentMusic <= 0){
        currentMusic = songs.length - 1;
    } else{
        currentMusic--;
    }
    setMusic(currentMusic);
    playMusic();
});

music.addEventListener('ended', playNextMusic);

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const volumeSlider = document.querySelector('.volume-slider');
    audio.volume = volumeSlider.value;

    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const volumeSlider = document.querySelector('.volume-slider');
    const canvas = document.getElementById('visualizer');
    const canvasCtx = canvas.getContext('2d');

    let audioContext;
    let analyser;
    let source;
    let bufferLength;
    let dataArray;

    function initializeAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);

            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);
        }
    }
    audio.volume = volumeSlider.value;
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value;
    });
    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;
            canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
            canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    document.querySelector('.play-btn').addEventListener('click', () => {
        initializeAudioContext();
        if (audio.play) {
            audio.paused();
        } else {
            audio.play();
        }
        draw();
    });
    audio.addEventListener('play', () => {
        initializeAudioContext();
        draw();
    });
});
