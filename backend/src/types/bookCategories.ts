const formatsArr = ['Físico', 'Digital', 'AudioLibro'] as const;
type FormatType = typeof formatsArr[number];

const genresArr = [
  'Novela',
  'Ciencia ficción',
  'Fantasía',
  'Misterio',
  'Biografía',
  'Romance',
  'Tecnología',
  'Ingenirería',
  'Terror',
  'Histórica',
  'Poesía',
  'No ficción',
  'Literatura juvenil',
  'Thriller',
  'Policiaca',
  'Aventura',
  'Drama',
  'Autoayuda',
  'Ensayo',
  'Educativo',
  'Literatura contemporánea',
  'Literatura clásica',
  'Ficción histórica',
  'Cuento',
  'Ciencia popular',
  'Literatura erótica',
  'Ficción especulativa',
  'Gótico',
  'Steampunk',
  'Magical realism',
  'Parodia',
  'Dystopía',
  'Realismo mágico',
  'Crónica',
  'Sátira',
  'Ficción psicológica',
  'Ficción literaria',
  'Relato corto',
  'Ficción de aventuras',
  'Amor',
  'Ficción familiar',
  'Filosofía',
  'Salud',
  'Gastronomía',
  'Cocina',
  'Ciencias políticas',
  'Tecnología',
  'Narrativa gráfica',
  'Graphic novel',
  'Ciencia ficción distópica',
  'Ficción alternativa',
  'Antología',
  'Novela gráfica',
  'Narrativa no lineal'
] as const
type GenreType = typeof genresArr[number];

const languagesArr = [
  'Español',
  'Inglés',
  'Francés',
  'Alemán',
  'Italiano',
  'Portugués',
  'Ruso',
  'Chino (Mandarín)',
  'Japonés',
  'Coreano',
  'Árabe',
  'Hindi',
  'Bengalí',
  'Turco',
  'Vietnamita',
  'Polaco',
  'Holandés',
  'Sueco',
  'Danés',
  'Noruego',
  'Finlandés',
  'Checo',
  'Húngaro',
  'Rumano',
  'Griego',
  'Hebreo',
  'Tailandés',
  'Ucraniano',
  'Malay',
  'Filipino (Tagalo)',
  'Indonesio',
  'Swahili',
  'Persa (Farsi)',
  'Serbio',
  'Croata',
  'Búlgaro',
  'Eslovaco',
  'Esloveno',
  'Catalán',
  'Gallego',
  'Vasco',
  'Latín',
  'Aragonés',
  'Sánscrito',
  'Tamil',
  'Telugu',
  'Gujarati',
  'Punjabi',
  'Otro'
] as const
type LanguageType = typeof languagesArr[number];

const statesArr = ['Nuevo Sellado', 'Un solo Uso', 'Usado', 'Con detalles y Rayones'] as const
type StateType = typeof statesArr[number];

const editionArr = ['', '1ra Edición', '2da Edición', 'Edición Especial',
    'Edición de Coleccionista', 'Reimpresión', 'Edición Limitada'] as const
type EditionType = typeof editionArr[number];

const coverArr = ['', 'Dura', 'Blanda', 'Semi-Dura', 'Edición de bolsillo', 'Sin tapa'] as const
type CoverType = typeof coverArr[number];

const ageArr = ['', 'Menor de 12 años', '13-18 años', '19-45 años', '46-65 años', 'Más de 65 años'] as const
type AgeType = typeof ageArr[number];

const availabilityArr = ['Disponible', 'No disponible', 'Vendido'] as const
type AvailabilityType = typeof availabilityArr[number];
export {
    formatsArr, FormatType,
    genresArr, GenreType,
    languagesArr, LanguageType,
    statesArr, StateType,
    editionArr, EditionType,
    coverArr, CoverType,
    ageArr, AgeType,
    availabilityArr, AvailabilityType
}