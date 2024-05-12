// Seleccionamos los elementos del DOM que vamos a utilizar
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

let timer;
// Función para ocultar los controles del video después de un tiempo
const hideControls = () => {
    if (mainVideo.paused) return;

    timer = setTimeout(() => {
        container.classList.remove('show-controls'); // Quitamos la clase que muestra los controles Después de 3 segundos
    }, 3000)
};

hideControls(); // Llamamos a la función al inicio

// Cuando se mueve el mouse sobre el contenedor, mostramos los controles y reiniciamos el temporizador
container.addEventListener('mousemove', () => {
    container.classList.add('show-controls');// Mostramos los controles
    clearTimeout(timer);// Reiniciamos el temporizador
    hideControls();// Volvemos a llamar a la función para que se oculten los controles después de un tiempo
});

// Función para formatear el tiempo en horas, minutos y segundos
const formatTime = time => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds
    minutes = minutes < 10 ? `0${minutes}` : minutes
    hours = hours < 10 ? `0${hours}` : hours

    if (hours == 0) return `${minutes}:${seconds}`;

    return `${hours}:${minutes}:${seconds}`;
};

// Cuando el tiempo del video cambia, actualizamos la barra de progreso y el tiempo actual del video
mainVideo.addEventListener('timeupdate', e => {

    let { currentTime, duration } = e.target;// Obtenemos el tiempo actual y la duración del video
    let percent = (currentTime / duration) * 100; // Calculamos el porcentaje de tiempo transcurrido

    progresBar.style.width = `${percent}%`; // Actualizamos el ancho de la barra de progreso
    currentVideoTime.textContent = formatTime(currentTime); // Actualizamos el tiempo actual del video
});

// Cuando los datos del video se han cargado, mostramos la duración total del video
mainVideo.addEventListener('loadeddata', (e) => {
    const { duration } = e.target; // Obtenemos la duración del video
    videoDuration.textContent = formatTime(duration); // Mostramos la duración total del video
});

// Cuando se hace clic en la línea de tiempo del video, cambiamos el tiempo actual del video
videoTimeLine.addEventListener('click', (e) => {

    let timeLineWidth = videoTimeLine.clientWidth; // Obtenemos el ancho de la línea de tiempo
    mainVideo.currentTime = (e.offsetX / timeLineWidth) * mainVideo.duration; // Cambiamos el tiempo actual del video
});

// Cuando se hace clic en el botón de volumen, cambiamos el volumen del video y el icono del botón
volumenBtn.addEventListener('click', () => {
    if (!volumenBtn.classList.contains('fa-volume-high')) {

        mainVideo.volume = 0.5; // Cambiamos el volumen a la mitad
        volumenBtn.classList.replace('fa-volume-xmark', 'fa-volume-high');// Cambiamos el icono a volumen alto
    } else {

        mainVideo.volume = 0.0; // Silenciamos el video
        volumenBtn.classList.replace('fa-volume-high', 'fa-volume-xmark');// Cambiamos el icono a volumen silenciado
    };
    volumenSlider.value = mainVideo.volume;
});

// Cuando se cambia el valor del deslizador de volumen, cambiamos el volumen del video y el icono del botón
volumenSlider.addEventListener('input', (e) => {

    const { value } = e.target;// Obtenemos el valor del deslizador
    mainVideo.volume = value; // Cambiamos el volumen del video

    if (value == 0) {
        volumenBtn.classList.replace('fa-volume-high', 'fa-volume-xmark'); // Si el volumen es 0, cambiamos el icono a volumen silenciado
    } else {
        volumenBtn.classList.replace('fa-volume-xmark', 'fa-volume-high'); // Si el volumen es mayor que 0, cambiamos el icono a volumen alto
    };

});

// Cuando se hace clic en una opción de velocidad de reproducción, cambiamos la velocidad de reproducción del video
[...speedOptions.querySelectorAll('li')].map(option => {
    option.addEventListener('click', () => {

        mainVideo.playbackRate = option.dataset.speed;// Cambiamos la velocidad de reproducción del video
        speedOptions.querySelector('.active').classList.remove('active');// Quitamos la clase activa de la opción actual
        option.classList.add('active'); // Añadimos la clase activa a la opción seleccionada

    });
});

// Cuando se hace clic en el botón de pantalla completa, cambiamos el modo de pantalla y el icono del botón
fullScreenBtn.addEventListener('click', () => {
    container.classList.toggle('fullscreen'); // Cambiamos el modo de pantalla

    if (document.fullscreenElement) {
        fullScreenBtn.classList.replace('fa-compress', 'fa-expand'); // Si estamos en pantalla completa, cambiamos el icono a expandir
        return document.exitFullscreen; // Salimos del modo de pantalla completa
    }
    fullScreenBtn.classList.replace('fa-expand', 'fa-compress'); // Si no estamos en pantalla completa, cambiamos el icono a comprimir
    container.requestFullscreen; // Entramos en modo de pantalla completa
});

// Función para cambiar el tiempo actual del video cuando se arrastra la barra de progreso
const dragableProgresBar = (e) => {
    const { offsetX } = e; // Obtenemos la posición del cursor en el eje X
    let timeLineWidth = videoTimeLine.clientWidth; // Obtenemos el ancho de la línea de tiempo

    progresBar.style.width = `${offsetX}px`;// Cambiamos el ancho de la barra de progreso
    mainVideo.currentTime = (offsetX / timeLineWidth) * mainVideo.duration;// Cambiamos el tiempo actual del video
    currentVideoTime.textContent = formatTime(mainVideo.currentTime); // Actualizamos el tiempo actual del video
};

// Cuando se mueve el mouse sobre la línea de tiempo, mostramos el tiempo correspondiente a la posición del cursor
videoTimeLine.addEventListener('mousemove', e => {

    const { offsetX } = e;// Obtenemos la posición del cursor en el eje X
    const progressTime = videoTimeLine.querySelector('span'); // Seleccionamos el elemento que muestra el tiempo
    let offsetx = offsetX;// Guardamos la posición del cursor en una variable
    let timeLineWidth = videoTimeLine.clientWidth;  // Obtenemos el ancho de la línea de tiempo
    let percent = (offsetX / timeLineWidth) * mainVideo.duration; // Calculamos el tiempo correspondiente a la posición del cursor

    progressTime.style.left = `${offsetx}px`; // Cambiamos la posición del elemento que muestra el tiempo
    progressTime.textContent = formatTime(percent); // Mostramos el tiempo correspondiente a la posición del cursor
});

// Cuando se presiona el botón del mouse sobre la línea de tiempo, empezamos a arrastrar la barra de progreso
videoTimeLine.addEventListener('mousedown', () => {
    videoTimeLine.addEventListener('mousemove', dragableProgresBar); // Añadimos el evento de mover el mouse a la línea de tiempo
});

// Cuando se suelta el botón del mouse, dejamos de arrastrar la barra de progreso
container.addEventListener('mouseup', () => {
    videoTimeLine.removeEventListener('mousemove', dragableProgresBar); // Quitamos el evento de mover el mouse de la línea de tiempo
});

// Cuando se hace clic en el botón de imagen en imagen, activamos el modo de imagen en imagen
picInpicBtn.addEventListener('click', () => {
    mainVideo.requestPictureInPicture();// Activamos el modo de imagen en imagen
});

// Cuando se hace clic en el botón de velocidad de reproducción, mostramos u ocultamos las opciones de velocidad de reproducción
speedBtn.addEventListener('click', () => {
    speedOptions.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    const { tagName, className } = e.target;
    if (tagName !== 'SPAN' || className !== 'material-symbols-rounded') {
        speedOptions.classList.remove('show');
    };
});

// Cuando se hace clic en el botón de retroceso, retrocedemos 5 segundos en el video
skipBackWard.addEventListener('click', () => {
    mainVideo.currentTime -= 5;// Retrocedemos 5 segundos en el video
});

// Cuando se hace clic en el botón de avance, avanzamos 5 segundos en el video
skipForWard.addEventListener('click', () => {
    mainVideo.currentTime += 5; // Avanzamos 5 segundos en el video
});

// Cuando se hace clic en el botón de reproducir/pausar, reproducimos o pausamos el video
playPauseBtn.addEventListener('click', () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause(); // Si el video está pausado, lo reproducimos. Si no, lo pausamos
});

// Cuando el video se reproduce, cambiamos el icono del botón a pausa
mainVideo.addEventListener('play', () => {
    playPauseBtn.classList.replace('fa-play', 'fa-pause');  // Cambiamos el icono a pausa
});

// Cuando el video se pausa, cambiamos el icono del botón a reproducir
mainVideo.addEventListener('pause', () => {
    playPauseBtn.classList.replace('fa-pause', 'fa-play'); // Cambiamos el icono a reproducir
});