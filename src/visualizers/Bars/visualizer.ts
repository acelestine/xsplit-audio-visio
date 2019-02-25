export default {}; // typescript stuff

let canvas: any;
let ctx: any;
let cache = {
  deviceId: '',
};

function render(deviceId: string) {
  if (cache.deviceId === deviceId) {
    return;
  }

  cache.deviceId = deviceId;

  navigator.mediaDevices
    .getUserMedia({
      audio: {
        deviceId,
      },
    })
    .then(stream => {
      const audioCtx = new AudioContext();
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
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

          x += barWidth + 1;
        }
      }
      renderFrame();
    });
}

function handlePropsChange({ detail }: any) {
  const { deviceId } = detail;
  render(deviceId);
}

window.init = function(obj: any) {
  const { deviceId } = obj;

  cache.deviceId = deviceId;
  canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  document.addEventListener('props-change', handlePropsChange);

  return () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener('props-change', handlePropsChange);
  };
};
