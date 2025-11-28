let all_plants = [];
let filtered = [];
let pooled = [];
let dim = 256;
let stride = 4;
let d = 0;
let k = 0;

let plant_disease_classifier;
let plant_types = 5;
let plant_images = 100;

function preload() {
  for (let i = 1; i < plant_types; i++) {
    all_plants[i] = [];

    for (let j = 0; j < plant_images; j++) {
      all_plants[i][j] = loadImage(`db/apple to tomato/${i} (${j + 1}).JPG`);
      //all_plants[i][j].resize(256,256);
      setTimeout(5000);
    }
  }
}

let filter = [
  [1, -1, 0],
  [1, -1, 0],
  [1, -1, 0],
];

// let filter=[
//   [1,0,1],
//   [0,1,0],
//   [1,0,1]
// ];

function setup() {
  createCanvas(dim * 2, dim * 2);

  for (let i = 1; i < plant_types; i++) {
    filtered[i] = [];
    pooled[i] = [];
    for (let j = 0; j < plant_images; j++) {
      filtered[i][j] = createImage(dim, dim);
      pooled[i][j] = createImage(dim / stride, dim / stride);
    }
  }

  background(200);
  noSmooth();
  //image(all_plants[3][9], 0, 0);

  for (let i = 1; i < plant_types; i++) {
    for (let j = 0; j < plant_images; j++) {
      all_plants[i][j].loadPixels();
    }
  }

  convolutionLayer();

  poolingLayer();

  // image(filtered[10][9], dim, 0);
  // image(pooled[10][9], 0, dim);
  // pooled[10][9].save()
  // filtered[10][9].save()

  let options = {
    inputs: [64, 64, 4],
    task: "imageClassification",
    debug: true,
  };

  plant_disease_classifier = ml5.neuralNetwork(options);
  for (let i = 1; i < plant_types; i++) {
    for (let j = 0; j < plant_images; j++) {
      plant_disease_classifier.addData(
        { image: pooled[i][j]},
        { label: `${i}` }
      );
    }
  }
  plant_disease_classifier.normalizeData();
  plant_disease_classifier.train({ epochs: 50 }, finshedtraining);
}

function finshedtraining() {
  console.log("finished training");
  plant_disease_classifier.save();
}

function index(x, y, img) {
  return (x + y * img.width) * 4;
}

function convolutionLayer() {
  for (let i = 1; i < plant_types; i++) {
    for (let j = 0; j < plant_images; j++) {
      filtered[i][j].loadPixels();
      let img = filtered[i][j];

      for (let x = 1; x < dim - 1; x++) {
        for (let y = 1; y < dim - 1; y++) {
          let rgb = convolution(all_plants[i][j], x, y, filter);
          let pix = index(x, y, filtered[i][j]);
          img.pixels[pix] = rgb.r;
          img.pixels[pix + 1] = rgb.g;
          img.pixels[pix + 2] = rgb.b;
          img.pixels[pix + 3] = 255;
        }
      }
      // setTimeout(30);
      filtered[i][j].updatePixels();
    }
  }
}

function convolution(img, x, y, filter) {
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      let pix = index(x + i, y + j, img);
      let factor = filter[j + 1][i + 1];
      sumR += img.pixels[pix + 0] * factor;
      sumG += img.pixels[pix + 1] * factor;
      sumB += img.pixels[pix + 2] * factor;
    }
  }
  return {
    r: sumR,
    g: sumG,
    b: sumB,
  };
}

function poolingLayer() {
  for (let i = 1; i < plant_types; i++) {
    for (let j = 0; j < plant_images; j++) {
      pooled[i][j].loadPixels();
      let img = pooled[i][j];

      for (let x = 0; x < dim - 1; x += stride) {
        for (let y = 0; y < dim - 1; y += stride) {
          let rgb = pooling(filtered[i][j], x, y);
          let pix = index(x / stride, y / stride, pooled[i][j]);
          img.pixels[pix] = rgb.r;
          img.pixels[pix + 1] = rgb.g;
          img.pixels[pix + 2] = rgb.b;
          img.pixels[pix + 3] = 255;
        }
      }
      //setTimeout(80);

      pooled[i][j].updatePixels();
    }
  }
}

function pooling(img, x, y) {
  let brightR = -Infinity;
  let brightG = -Infinity;
  let brightB = -Infinity;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let pix = index(x + i, y + j, img);
      let r = img.pixels[pix];
      let g = img.pixels[pix + 1];
      let b = img.pixels[pix + 2];

      brightR = max(brightR, r);
      brightB = max(brightB, b);
      brightG = max(brightG, g);
    }
  }

  return {
    r: brightR,
    g: brightG,
    b: brightB,
  };
}

function draw() {
  //background(255);
  text(d, dim / 2, dim / 2);
  text(k, dim, dim);
  color(255);
}
