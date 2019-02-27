/**
 * Visualizer logic initially copied from:
 * https://codepen.io/nfj525/pen/rVBaab
 */
let audioCtx = new AudioContext();
let canvas: any;
let ctx: any;
let cache = {
  audio: '',
};

function render(audio = 'default') {
  console.log(audio);
  if (cache.audio === audio) {
    return;
  }

  cache.audio = audio;

  navigator.mediaDevices
    .getUserMedia({
      audio: {
        deviceId: audio,
      },
    })
    .then(stream => {
      audioCtx.close();
      audioCtx = new AudioContext();
      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();

      src.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;

      const dataArray = new Uint8Array(bufferLength);

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      function renderFrame() {
        requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          const r = barHeight + 25 * (i / bufferLength);
          const g = 250 * (i / bufferLength);
          const b = 50;

          ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
          ctx.fillRect(x, HEIGHT - barHeight * 5.5, barWidth, barHeight * 5.5);

          x += barWidth + 1;
        }
      }
      renderFrame();
    });
}

function handlePropsChange({ detail }: any) {
  const { audio } = detail;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  render(audio);
}

export default function(obj: any) {
  const { audio } = obj;

  cache.audio = audio;
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  document.addEventListener('props-change', handlePropsChange);
  render(audio);

  return () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener('props-change', handlePropsChange);
  };
}
