const video = document.getElementById('video');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const refreshBtn = document.getElementById('refresh-btn');
const infoBar = document.getElementById('info-bar');
const videoContainer = document.getElementById('video-container');
const watermark = document.getElementById('watermark');
const loadingIndicator = document.getElementById('loading-indicator');

const streams = [
    {
        url: 'https://example.com/dasara.mp4',
        title: 'DASARA',
        startTime: new Date().setHours(8, 0, 0, 0),
        endTime: new Date().setHours(11, 29, 0, 0)
    },
    {
        url: 'https://example.com/lucky_bhaskar.mp4',
        title: 'LUCKY BHASKAR',
        startTime: new Date().setHours(13, 25, 0, 0),
        endTime: new Date().setHours(16, 0, 0, 0)
    },
    {
        url: 'https://example.com/devara_part1.mp4',
        title: 'DEVARA: PART 1',
        startTime: new Date().setHours(16, 0, 0, 0),
        endTime: new Date().setHours(17, 0, 0, 0)
    },
    {
        url: 'https://example.com/evening_show.mp4',
        title: '5PM to 8PM Show',
        startTime: new Date().setHours(17, 0, 0, 0),
        endTime: new Date().setHours(20, 0, 0, 0)
    },
    {
        url: 'https://example.com/night_show.mp4',
        title: '8PM to 11PM Show',
        startTime: new Date().setHours(20, 0, 0, 0),
        endTime: new Date().setHours(23, 0, 0, 0)
    }
];
let currentStreamIndex = 0;

function showLoading() {
    loadingIndicator.style.display = 'block';  // Show loading
}

function hideLoading() {
    loadingIndicator.style.display = 'none';  // Hide loading when video is ready
}

function loadStream(offsetSeconds = 0) {
    showLoading();
    const stream = streams[currentStreamIndex];
    video.src = stream.url;
    video.currentTime = offsetSeconds;
    video.load();

    // Wait until the video metadata (duration) is loaded before playing
    video.onloadeddata = () => {
        video.play();
        video.muted = false;
        infoBar.textContent = `Now Playing: ${stream.title}`;
        hideLoading();  // Hide loading when video is ready
    };
}

function syncWithTime() {
    const now = new Date();
    const stream = streams[currentStreamIndex];

    if (now >= stream.endTime) {
        playNextStream();
    } else if (now >= stream.startTime) {
        const offset = Math.max((now - stream.startTime) / 1000, 0);
        loadStream(offset);
    } else {
        setTimeout(syncWithTime, stream.startTime - now);
    }
}

function playNextStream() {
    if (currentStreamIndex < streams.length - 1) {
        currentStreamIndex++;
        syncWithTime();
    } else {
        infoBar.textContent = 'No more streams available.';
    }
}

function updateInfoBarRandomly() {
    const currentStream = streams[currentStreamIndex];
    const nextStream = streams[currentStreamIndex + 1] || streams[0]; // Loop back to the first stream

    const currentText = `Now Playing: ${currentStream?.title || 'No Current Movie'}`;
    const nextText = `Next: ${nextStream?.title || 'No Upcoming Movies'} at ${
        nextStream
            ? new Date(nextStream.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
              })
            : '-'
    }`;

    // Randomly pick between current or next movie's info
    const randomText = Math.random() > 0.5 ? currentText : nextText;
    infoBar.textContent = randomText;

    setTimeout(updateInfoBarRandomly, 3000); // Update every 3 seconds
}

function enableFullscreen() {
    videoContainer.requestFullscreen().then(() => {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(err => {
                console.warn("Orientation lock failed:", err);
            });
        }
        videoContainer.classList.add('fullscreen');
        watermark.style.display = 'block'; // Show watermark in fullscreen mode
        fullscreenBtn.style.display = 'none';
    });
}

fullscreenBtn.addEventListener('click', enableFullscreen);

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        videoContainer.classList.remove('fullscreen');
        watermark.style.display = 'none'; // Hide watermark when exiting fullscreen
        fullscreenBtn.style.display = 'inline-block';
    }
});

refreshBtn.addEventListener('click', () => {
    syncWithTime();
});

window.addEventListener('load', () => {
    syncWithTime();
    updateInfoBarRandomly(); // Start randomly showing info
});
