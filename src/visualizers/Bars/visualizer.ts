/**
 * Visualizer logic initially copied from:
 * https://codepen.io/nfj525/pen/rVBaab
 */
let audioCtx = new AudioContext();
let canvas: any;
let ctx: any;

function render(audio = 'default', sensitivity = 5) {
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
          ctx.fillRect(
            x,
            HEIGHT - barHeight * sensitivity,
            barWidth,
            barHeight * sensitivity
          );

          x += barWidth + 1;
        }
      }
      renderFrame();
    });
}

function computeSensitivity(value: number) {
  const sensitivity = value / 10;

  if (value < 1) {
    return 1;
  }

  return sensitivity;
}

function handlePropsChange({ detail }: any) {
  const { audio, sensitivity } = detail;

  if (canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render(audio, computeSensitivity(sensitivity));
}

export default function(obj: any) {
  const { audio, sensitivity } = obj;

  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.addEventListener('props-change', handlePropsChange);
  render(audio, computeSensitivity(sensitivity));

  return () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener('props-change', handlePropsChange);
  };
}
