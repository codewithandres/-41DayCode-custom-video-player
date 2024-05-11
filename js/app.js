
const container = document.querySelector('.container'),
    mainVideo = document.querySelector('video'),
    playPauseBtn = document.querySelector('.play-pause i'),
    progresBar = document.querySelector('.progress-bar'),
    skipBackWard = document.querySelector('.skip-backward i'),
    skipForWard = document.querySelector('.skip-forward i');

mainVideo.addEventListener('timeupdate', e => {
    let { currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;

    progresBar.style.width = `${percent}%`;
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