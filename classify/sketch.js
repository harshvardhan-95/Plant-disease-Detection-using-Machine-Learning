let leaves = [];
let video;
let fileInput;
let ss;
let button;
let final = [];
let sel;
let classifier;
let item = "Apple";
let imagecapture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Position elements based on screen size
  const x = width / 2;
  const y = height * 0.8;

  video = createCapture(VIDEO);
  video.size(64, 64);
  video.hide();

  sel = createSelect();
  sel.option("Apple");
  sel.option("Corn");
  sel.option("Grape");
  sel.option("Potato");
  sel.option("Tomato");
  sel.option("Sugarcane");
  sel.selected("Apple");
  sel.changed(selEvent);

  sel.style("background-color", "#000");
  sel.style("background-image", "linear-gradient(to right, #02AAB0 0%, #00CDAC  51%, #02AAB0  100%)");
  sel.style("color", "white");
  sel.style("padding", "10px");
  sel.style("font-size", "30px");
  sel.position(x, y);
  sel.style('transform', 'translate(-50%, -50%)');

  fileInput = createFileInput(handleFile);
  fileInput.style("font-size", "20px");

  let options = {
    inputs: [64, 64, 4],
    task: "imageClassification",
  };

  for (let i = 0; i <= 4; i++) {
    leaves[i] = ml5.neuralNetwork(options);

    let modelDetails = {
      model: `model/${i}/model.json`,
      metadata: `model/${i}/model_meta.json`,
      weights: `model/${i}/model.weights.bin`,
    };
    leaves[i].load(modelDetails, modelready);
  }

  button = createButton("Classify");
  button.mousePressed(classifyByUpload);
  button.position(x, y + 100);

  classifier = ml5.neuralNetwork(options);

  imagecapture = createButton("Capture and Classify");
  imagecapture.mousePressed(classifyByVideo);
  imagecapture.position(width / 6, height * 0.7);

  // Call windowResized() whenever the window is resized
  windowResized();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Reposition elements based on new screen size
  const x = width / 2;
  const y = height * 0.8;
  sel.position(x, y);
  button.position(x, y + 100);
  fileInput.position(width * 0.72, height * 0.5);
  imagecapture.position(width / 6, height * 0.7);
}

// Rest of your code...
function classifyByVideo() {
  clear();
  const x = width / 2 - 100;
  const y = height / 2 - 100;
  image(video, x, y, 200, 200);

  let i;
  if (item == "Apple") i = 0;
  else if (item == "Corn") i = 1;
  else if (item == "Grape") i = 2;
  else if (item == "Potato") i = 3;
  else if (item == "Tomato") i = 4;
  else if (item == "Sugarcane") classifier.classify({ image: video }, gotresultsForVideo);
  
  if(i<5)
  leaves[i].classify({ image: video }, gotresultsForVideo);
}

function selEvent() {
  item = sel.value();
}

function classifyByUpload() {
  clear();
  let i;
  if (item == "Apple") i = 0;
  else if (item == "Corn") i = 1;
  else if (item == "Grape") i = 2;
  else if (item == "Potato") i = 3;
  else if (item == "Tomato") i = 4;
  else if (item == "Sugarcane") classifier.classify({ image: ss }, gotresultsForUpload);;
 
  if(i<5)
  leaves[i].classify({ image: ss }, gotresultsForUpload);
}

function handleFile(file) {
  if (file.type === "image") {
    img = loadImage(file.data, () => {
      const x = width / 2 - 100;
      const y = height / 2 - 100;
      image(img, x, y, 200, 200);
      img.resize(64, 64);
      ss = img;
    });
    img1 = loadImage(file.data, () => {
      
    });
  } else {
    img = null;
  }
}

function modelready() {
  console.log("model is ready");
}

function gotresultsForUpload(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(results);
  final[0] = results[0].label;

  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text(final[0], width / 2, 175);
  let textWidthValue = textWidth(final[0]);

  fill(0, 255, 0);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, 175, textWidthValue, 50);

  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text(final[0], width / 2, 175);
  const x = width / 2 - 100;
  const y = height / 2 - 100;
  image(img1, x, y, 200, 200);
}

function gotresultsForVideo(err, results) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(results);
  final[1] = results[0].label;

  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text(final[1], width / 2, 175);
  let textWidthValue = textWidth(final[1]);

  // fill(255,165,0);
  fill(0,255,0);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, 175, textWidthValue, 50);

  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text(final[1], width / 2, 175);
}

function draw() {
  image(video, 250, 270, 200, 200);
  fill(0);
  textSize(50);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(255);
  textStyle(BOLD);
  text("Plant Disease Detection", width / 2, 60);

  textSize(30);
  textAlign(CENTER, CENTER);
  fill(	0);
  
  // Position the text sections below the buttons
 
  text("Classification by Uploaded Images",2* width / 3+200,200);
  text("Classification by Video", width / 6+50, 200);
}


