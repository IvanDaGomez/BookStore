import swaggerAutogen from 'swagger-autogen'

import path from 'node:path'
const outputFile = path.join('.', 'data', 'swagger.json')

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
