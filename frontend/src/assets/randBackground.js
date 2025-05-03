export function randBackground(){
  // Light colors
  const colors = [
    '#FFFAF070', // Floral White
    '#FFFACD70', // Lemon Chiffon
    '#E6E6FA70', // Lavender
    '#F0E68C70', // Khaki
    '#F5FFFA70', // Mint Cream
    '#F0FFF070', // Honeydew
    '#D3D3D370', // Light Gray
    '#ADD8E670', // Light Blue
    '#B0E0E670', // Powder Blue
    '#E0FFFF70', // Light Cyan
    '#F5F5F570', // White Smoke
    '#FFF0F570', // Lavender Blush
    '#FFDEAD70', // Navajo White
    '#FFD70070', // Gold
    '#F8F8FF70', // Ghost White
    '#F5F5DC70', // Beige
    '#FFEBEE70', // Pale Pink
    '#F0F8FF70', // Alice Blue
    '#F7F8F770', // Light Ivory
    '#F2F8F270'  // Snow
  ];

  return colors[Math.floor(Math.random() * colors.length)]
}