var Jimp = require('jimp');
var path = require('path');
//if you are following along, create the following 2 images relative to this script:

let frame = path.join(__dirname, 'raw/1.0-inch-frame_Natural.png'); // frame's path
let painting = path.join(__dirname,'raw/logo.png'); // painting's path
//
console.log(frame);
console.log(painting);

let imgActive = 'active/image.jpg'; // cloned image for operations
let imgExported = 'export/image1.jpg'; // output file 


//read template & clone raw image 
Jimp.read(frame)
  .then(tpl => {
    tpl.autocrop().resize(1080, Jimp.AUTO).clone().write(imgActive);
  })
  
  //read cloned (active) image
  .then(() => (Jimp.read(imgActive)))

  //combine logo into image
  .then(tpl => (
    Jimp.read(painting).then(paintTpl => {
      paintTpl.opacity(1).resize(872,700);
      return tpl.composite(paintTpl, 108, 100, [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
    })
  ))

  //export image
  .then(tpl => (tpl.quality(100).write(imgExported)))

  //log exported filename
  .then(tpl => { 
    console.log('exported file: ' + imgExported);
  })
  //catch errors
  .catch(err => {
    console.error(err);
  });