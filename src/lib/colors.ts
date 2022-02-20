/**
 * Created a lighter/darker shade of a given color
 * @param color the hexadecimal representation of the color to be adjusted
 * @param luminosity number ranging from -1 to 1 which represents the brightness addition/subtraction
 * @returns a new color value in the hexadecimal format
 */
export const changeColorBrightness = (color: string, luminosity: number) => {
  const black = 0;
  const white = 255;
  let newColor = '#';
  let newColorValue;

  color = color.replace(/[^\da-f]/gi, '');

  for (let i = 0; i < 3; i++) {
    newColorValue = parseInt(color.slice(i * 2, i * 2 + 2), 16);
    newColorValue = Math.round(
      Math.min(Math.max(black, newColorValue + luminosity * white), white),
    ).toString(16);
    newColor += ('00' + newColorValue).slice(newColorValue.length);
  }

  return newColor;
};
