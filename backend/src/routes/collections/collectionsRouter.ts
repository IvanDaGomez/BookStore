import Router, { RequestHandler } from 'express'
import { CollectionsController } from '../../controllers/collections/collectionsController.js'
import { upload } from '../../assets/config.js'
import { IBooksModel, ICollectionsModel } from '../../types/models.js'

export const createCollectionsRouter = ({ CollectionsModel, BooksModel }:
  { CollectionsModel: ICollectionsModel
    BooksModel: IBooksModel }
) => {
  const collectionsRouter = Router()
  const collectionsController = new CollectionsController({ CollectionsModel, BooksModel })
  collectionsRouter.get('/', collectionsController.getAllCollections as RequestHandler)

  collectionsRouter.get('/getCollectionById/:collectionId', collectionsController.getCollectionById as RequestHandler)
  collectionsRouter.get('/getCollectionsByUser/:userId', collectionsController.getCollectionsByUser as RequestHandler)
  collectionsRouter.get('/getBooksByCollection/:collectionId', collectionsController.getBooksByCollection as RequestHandler)
  collectionsRouter.get('/fyp', collectionsController.forYouPageCollections as RequestHandler)
  collectionsRouter.post('/', upload.single('images'), collectionsController.createCollection as RequestHandler)
  collectionsRouter.get('/addToCollection', collectionsController.addBookToCollection as RequestHandler)

  collectionsRouter.get('/query', collectionsController.getCollectionByQuery as RequestHandler)
  collectionsRouter.get('/query/filters', collectionsController.getCollectionsByQueryWithFilters as RequestHandler)
  collectionsRouter.post('/collectionSaga', collectionsController.getCollectionSaga as RequestHandler)

  collectionsRouter.delete('/:collectionId', collectionsController.deleteCollection as RequestHandler)
  collectionsRouter.patch('/:collectionId', collectionsController.updateCollection as RequestHandler)

  return collectionsRouter
}
