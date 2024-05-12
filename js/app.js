
const container = document.querySelector('.container'),
    mainVideo = document.querySelector('video'),
    playPauseBtn = document.querySelector('.play-pause i'),
    progresBar = container.querySelector('.progress-bar'),
    skipBackWard = container.querySelector('.skip-backward i'),
    skipForWard = container.querySelector('.skip-forward i'),
    volumenBtn = container.querySelector('.volume i'),
    volumenSlider = container.querySelector('.left input'),
    speedBtn = container.querySelector('.playback-speed span'),
    speedOptions = container.querySelector('.speed-options'),
    picInpicBtn = container.querySelector('.pic-in-pic span'),
    fullScreenBtn = container.querySelector('.fullscreen i'),
    videoTimeLine = container.querySelector('.video-timeline'),
    currentVideoTime = container.querySelector('.current-time'),
    videoDuration = container.querySelector('.video-duration');

const formatTime = time => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours

    if (hours == 0)`${minutes}:${seconds}`;

    return `${hours}:${minutes}:${seconds}`;
};

mainVideo.addEventListener('timeupdate', e => {

    let { currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;

    progresBar.style.width = `${percent}%`;
    currentVideoTime.textContent = formatTime(currentTime);
});

mainVideo.addEventListener('loadeddata', (e) => {
    const { duration } = e.target;
    videoDuration.textContent = formatTime(duration);
});

videoTimeLine.addEventListener('click', e => {
    const { clientWidth } = e.target;
    let timeLineWidth = clientWidth;
    mainVideo.currentTime = (e.offsetX / timeLineWidth) * mainVideo.duration;
});

volumenBtn.addEventListener('click', () => {
    if (!volumenBtn.classList.contains('fa-volume-high')) {

        mainVideo.volume = 0.5;
        volumenBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    } else {

        mainVideo.volume = 0.0;
        volumenBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    };
    volumenSlider.value = mainVideo.volume;
});

volumenSlider.addEventListener('input', e => {

    const { value } = e.target;
    mainVideo.volume = value;

    if (value == 0) {
        volumenBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');
    } else {
        volumenBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');
    }

});

[...speedOptions.querySelectorAll('li')].map(option => {
    option.addEventListener('click', () => {

        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector('.active').classList.remove('active');
        option.classList.add('active');

    });
});

fullScreenBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen');

    if (document.fullscreenElement) {
        fullScreenBtn.classList.replace('fa-compress', 'fa-expand');
        return document.exitFullscreen;
    }
    fullScreenBtn.classList.replace('fa-expand', 'fa-compress');
    container.requestFullscreen;
});

picInpicBtn.addEventListener('click', () => {
    mainVideo.requestPictureInPicture();
});

speedBtn.addEventListener('click', () => {
    speedOptions.classList.toggle('show');
});

document.addEventListener('click', e => {
    const { tagName, className } = e.target;
    if (tagName !== 'SPAN' || className !== 'material-symbols-rounded') {
        speedOptions.classList.remove('show');
    };
});

skipBackWard.addEventListener('click', () => {
    mainVideo.currentTime -= 5;
});

skipForWard.addEventListener('click', () => {
    mainVideo.currentTime += 5;
});

playPauseBtn.addEventListener('click', () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener('play', () => {
    playPauseBtn.classList.replace('fa-play', 'fa-pause');
});

mainVideo.addEventListener('pause', () => {
    playPauseBtn.classList.replace('fa-pause', 'fa-play');
});