const swaggerAutogen = require('swagger-autogen')()

const doc = () => {
  return {
    info: {
      version: '1.0.0',
      title: 'User',
      description:
        'Documentation automatically generated by the <b>swagger-autogen</b> module.',
    },
    host: 'localhost:5002',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [],
    securityDefinitions: {
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header', // can be "header", "query" or "cookie"
        name: 'X-API-KEY', // name of the header, query parameter or cookie
        description: 'any description...',
      },
    },
  }
}

const outputFile = 'entreprise-service/swagger-output.json'
const endpointsFiles = ['entreprise-service/index.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
