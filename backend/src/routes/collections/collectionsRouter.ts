import Router, { RequestHandler } from 'express'
import { CollectionsController } from '../../controllers/collections/collectionsController.js'
import { upload } from '../../assets/config.js'
import { IBooksModel, ICollectionsModel } from '../../types/models.js'

export const createCollectionsRouter = ({
  CollectionsModel,
  BooksModel
}: {
  CollectionsModel: ICollectionsModel
  BooksModel: IBooksModel
}) => {
  const collectionsRouter = Router()
  const collectionsController = new CollectionsController({
    CollectionsModel,
    BooksModel
  })
  collectionsRouter.get(
    '/',
    collectionsController.getAllCollections as RequestHandler
  )

  collectionsRouter.get(
    '/getCollectionById/:collection_id',
    collectionsController.getCollectionById as RequestHandler
  )
  collectionsRouter.get(
    '/getCollectionsByUser/:user_id',
    collectionsController.getCollectionsByUser as RequestHandler
  )
  collectionsRouter.get(
    '/getBooksByCollection/:collection_id',
    collectionsController.getBooksByCollection as RequestHandler
  )
  collectionsRouter.get(
    '/fyp',
    collectionsController.forYouPageCollections as RequestHandler
  )
  collectionsRouter.post(
    '/',
    upload.single('images'),
    collectionsController.createCollection as RequestHandler
  )
  collectionsRouter.get(
    '/addToCollection',
    collectionsController.addBookToCollection as RequestHandler
  )

  collectionsRouter.get(
    '/query',
    collectionsController.getCollectionByQuery as RequestHandler
  )
  collectionsRouter.get(
    '/query/filters',
    collectionsController.getCollectionsByQueryWithFilters as RequestHandler
  )
  collectionsRouter.post(
    '/collectionSaga',
    collectionsController.getCollectionSaga as RequestHandler
  )

  collectionsRouter.delete(
    '/:collection_id',
    collectionsController.deleteCollection as RequestHandler
  )
  collectionsRouter.patch(
    '/:collection_id',
    collectionsController.updateCollection as RequestHandler
  )

  return collectionsRouter
}
