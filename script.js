const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400// window.innerWidth - 80; // subtract palette width
canvas.height =  window.innerHeight;

let isDrawing = false;
let currentColor = '#FF0000';

// Load base image
const baseImage = new Image();
baseImage.src = 'images/boy-lineart.png'; /* family-lineart.png */

// Load mask
const maskImage = new Image();
maskImage.src = 'images/shirt-mask.png';

// Off-screen mask canvas
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });

maskImage.onload = () => {
  maskCanvas.width = canvas.width;
  maskCanvas.height = canvas.height;
  maskCtx.drawImage(maskImage, 0, 0, 330, 243, 0, 261, 330, 243);
};

baseImage.onload = () => {
  //ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseImage, 0, 0, 328, 955);
};

function isInsideMask(x, y) {
  const pixel = maskCtx.getImageData(x, y, 1, 1).data;
  return pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255;
}

canvas.addEventListener('pointerdown', (e) => {
  isDrawing = true;
  ctx.beginPath(); // ← Add this here
  draw(e);
});

canvas.addEventListener('pointermove', draw);

canvas.addEventListener('pointerup', () => {
  isDrawing = false;
  ctx.beginPath();
});

function draw(e) {
  if (!isDrawing) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (isInsideMask(x, y)) {
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;
    ctx.globalAlpha = 0.10

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else {
    ctx.beginPath(); // reset if outside mask
  }
}

// Color picker

const buttons = document.querySelectorAll('.color')
function resetBtnBorder() {
  buttons.forEach(btn => {
    btn.classList.remove('selected')
  })
}
buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    resetBtnBorder()
    //currentColor = btn.dataset.color;
    //btn.classList.add('selected')
    currentColor = e.currentTarget.dataset.color;
    console.log(currentColor)
    e.currentTarget.classList.add('selected')
  });
});
