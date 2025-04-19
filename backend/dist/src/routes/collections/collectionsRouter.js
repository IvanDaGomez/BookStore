import Router from 'express';
import { CollectionsController } from '../../controllers/collections/collectionsController.js';
import { upload } from '../../assets/config.js';
export const createCollectionsRouter = ({ CollectionsModel, BooksModel }) => {
    const collectionsRouter = Router();
    const collectionsController = new CollectionsController({ CollectionsModel, BooksModel });
    collectionsRouter.get('/', collectionsController.getAllCollections);
    collectionsRouter.get('/getCollectionById/:collectionId', collectionsController.getCollectionById);
    collectionsRouter.get('/getCollectionsByUser/:userId', collectionsController.getCollectionsByUser);
    collectionsRouter.get('/getBooksByCollection/:collectionId', collectionsController.getBooksByCollection);
    collectionsRouter.post('/', upload.single('images'), collectionsController.createCollection);
    collectionsRouter.post('/addToCollection', collectionsController.addBookToCollection);
    collectionsRouter.get('/query', collectionsController.getCollectionByQuery);
    collectionsRouter.get('/query/filters', collectionsController.getCollectionsByQueryWithFilters);
    collectionsRouter.post('/collectionSaga', collectionsController.getCollectionSaga);
    collectionsRouter.delete('/:collectionId', collectionsController.deleteCollection);
    collectionsRouter.patch('/:collectionId', collectionsController.updateCollection);
    return collectionsRouter;
};
