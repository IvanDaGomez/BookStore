import Router from 'express'
import { CollectionsController } from '../../controllers/collections/collectionsController.js'
import { upload } from '../../assets/config.js'
const collectionsRouter = Router()

collectionsRouter.get('/', CollectionsController.getAllCollections)

collectionsRouter.get('/getCollectionById/:collectionId', CollectionsController.getCollectionById)
collectionsRouter.get('/getCollectionsByUser/:userId', CollectionsController.getCollectionsByUser)
collectionsRouter.get('/getBooksByCollection/:collectionId', CollectionsController.getBooksByCollection)

collectionsRouter.post('/', upload.single('images'), CollectionsController.createCollection)
collectionsRouter.post('/addToCollection', CollectionsController.addBookToCollection)

collectionsRouter.delete('/:collectionId', CollectionsController.deleteCollection)
collectionsRouter.patch('/:collectionId', CollectionsController.updateCollection)

export { collectionsRouter }
