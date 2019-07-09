var Jimp = require('jimp');
var path = require('path');
//if you are following along, create the following 2 images relative to this script:

let imgRaw = path.join(__dirname, 'raw/image1.png'); //a 1024px x 1024px backgroound image
let imgLogo = path.join(__dirname,'raw/logo.png'); //a 155px x 72px logo
//
console.log(imgRaw);
console.log(imgLogo);

let imgActive = 'active/image.jpg';
let imgExported = 'export/image1.jpg';

let textData = {
  text: '© Bit Brothers Pvt Ltd', //the text to be rendered on the image
  maxWidth: 1004, //image width - 10px margin left - 10px margin right
  maxHeight: 72+20, //logo height + margin
  placementX: 10, // 10px in on the x axis
  placementY: 1024-(72+20)-10 //bottom of the image: height - maxHeight - margin 
};

//read template & clone raw image 
Jimp.read(imgRaw)
  .then(tpl => (tpl.clone().write(imgActive)))

  //read cloned (active) image
  .then(() => (Jimp.read(imgActive)))

  //combine logo into image
  .then(tpl => (
    Jimp.read(imgLogo).then(logoTpl => {
      logoTpl.opacity(0.7).resize(175,275);
      return tpl.composite(logoTpl, 275, 100, [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
    })
  ))

  //load font	
  .then(tpl => (
    Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => ([tpl, font]))
  ))
	
  //add footer text
  .then(data => {
    // console.log(data);
    tpl = data[0];
    font = data[1];
  
    return tpl.print(font, textData.placementX, textData.placementY, {
      text: textData.text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, textData.maxWidth, textData.maxHeight);
  })

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