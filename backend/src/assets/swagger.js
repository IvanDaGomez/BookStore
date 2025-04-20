import swaggerAutogen from 'swagger-autogen'

const outputFile = './src/data/swagger.json'

const endpointsFiles = ['./src/index.ts']

const doc = {
  info: {
    title: 'API',
    description: 'API for Book Collection'
  },
  host: 'localhost:3030',
  schemes: ['http']
  // Tags
}

swaggerAutogen()(outputFile, endpointsFiles, doc)
