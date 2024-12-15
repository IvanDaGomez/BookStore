import Router from 'express'
import { CollectionsController } from '../../controllers/collections/collectionsController.js'
const collectionsRouter = Router()

collectionsRouter.get('/', CollectionsController.getAllCollections)

collectionsRouter.get('/id/:collectionId', CollectionsController.getCollectionById)
collectionsRouter.get('/user/:userId', CollectionsController.getCollectionsByUser)

collectionsRouter.post('/', CollectionsController.createCollection)
collectionsRouter.post('/addToCollection', CollectionsController.addBookToCollection)

collectionsRouter.delete('/:collectionId', CollectionsController.deleteCollection)
collectionsRouter.patch('/:collectionId', CollectionsController.updateCollection)

export { collectionsRouter }
