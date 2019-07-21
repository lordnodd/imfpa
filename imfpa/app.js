var Jimp = require('jimp');
var path = require('path');
//if you are following along, create the following 2 images relative to this script:

let imgRaw = path.join(__dirname, 'raw/1.0-inch-frame_Brown.png'); //a 1024px x 1024px backgroound image
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
  placementX: 600, // 10px in on the x axis
  placementY: 1350-(72+20)-10 //bottom of the image: height - maxHeight - margin 
};

//read template & clone raw image 
Jimp.read(imgRaw)
  .then(tpl => {
    tpl.autocrop().resize(1080, Jimp.AUTO).clone().write(imgActive);
  })
  //read cloned (active) image
  .then(() => (Jimp.read(imgActive)))

  //combine logo into image
  .then(tpl => (
    Jimp.read(imgLogo).then(logoTpl => {
      logoTpl.opacity(1).resize(802,600);
      return tpl.composite(logoTpl, 138, 138, [Jimp.BLEND_DESTINATION_OVER, 1, 1]);
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