/*
* convert hex code to rgba
*/
function hexToRgbA(hex) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return (
      'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',.5)'
    );
  }
  throw new Error('Bad Hex');
}

/*
* "hardcoded list of 10 colors that i personally like" - sherif
*/
const good_color_palette = [
  hexToRgbA('#00b894'), // green
  hexToRgbA('#0984e3'), // blue
  hexToRgbA('#6c5ce7'), // purple
  hexToRgbA('#fdcb6e'), // yellow
  hexToRgbA('#e17055'), // orange
  hexToRgbA('#d63031'), // red
  hexToRgbA('#e84393'), // pink
  hexToRgbA('#00cec9'), // turquoise
  hexToRgbA('#55efc4'), // light green
  hexToRgbA('#74b9ff'), // light blue
  hexToRgbA('#a29bfe'), // light purple
  hexToRgbA('#ffeaa7'), // light yellow
  hexToRgbA('#fab1a0'), // light orange
  hexToRgbA('#ff7675'), // pink
];

import randomColor from 'randomcolor';

/*
* generate 5000 random colors for clusters
*/
let color_palette = randomColor({
  count: 5000,
  format: 'rgba',
  hue: 'red, orange,blue, purple',
  luminosity: 'dark',
  alpha: 0.6 // e.g. 'rgba(9, 1, 107, 0.5)',
});

let final_color_palette = [...good_color_palette, ...color_palette];

export default final_color_palette;