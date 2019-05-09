/**
 * Visualizer logic initially copied from:
 * https://codepen.io/nfj525/pen/rVBaab
 */
let audioCtx = new AudioContext();
let canvas: any;
let ctx: any;
let lastReq: any;

function render({
  audio = 'audioinput-Default',
  sensitivity = 5,
  color = '#F47373',
  bars = 8,
}) {
  navigator.mediaDevices
    .getUserMedia({
      audio: {
        deviceId: audio,
      },
    })
    .then(stream => {
      // Cleanup
      audioCtx.close();
      audioCtx = new AudioContext();
      cancelAnimationFrame(lastReq);

      const src = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      src.connect(analyser);
      analyser.connect(audioCtx.destination);

      analyser.fftSize = bars * 4; // From MDN: 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, and 32768.

      const bufferLength = analyser.frequencyBinCount; // half of fftSize

      const dataArray = new Uint8Array(bufferLength); // Create array of size bufferLength initialized with 0s

      const barWidth = (WIDTH / bufferLength) * 2 - 5;
      let barHeight;
      let x = 0;

      function renderFrame() {
        lastReq = requestAnimationFrame(renderFrame);

        x = 0;

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(
              x,
              HEIGHT - barHeight * sensitivity,
              barWidth,
              barHeight * sensitivity
            );
          }

          x += barWidth + 5;
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
  const {
    audio = 'default',
    sensitivity = 50,
    color = '#F47373',
    bars = 8,
  } = detail;

  if (canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render({ audio, sensitivity: computeSensitivity(sensitivity), color, bars });
}

export default function(obj: any) {
  const { audio, sensitivity = 50, color = '', bars = 8 } = obj;

  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.addEventListener('props-change', handlePropsChange);
  render({ audio, sensitivity: computeSensitivity(sensitivity), color, bars });

  return () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener('props-change', handlePropsChange);
  };
}
