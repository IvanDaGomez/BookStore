import { Router } from 'express';
import { UsersController } from '../../controllers/users/usersController.js';
import { upload } from '../../assets/config.js';
export const createUsersRouter = ({ UsersModel, TransactionsModel }) => {
    const usersController = new UsersController({ UsersModel, TransactionsModel });
    const usersRouter = Router();
    usersRouter.get('/', usersController.getAllUsersSafe); // R
    usersRouter.post('/', usersController.createUser); // C
    // usersRouter.get('/safe', usersController.getAllUsersSafe) // R
    usersRouter.post('/login', usersController.login);
    usersRouter.post('/google-login', usersController.googleLogin);
    usersRouter.post('/facebook-login', usersController.facebookLogin);
    usersRouter.post('/logout', usersController.logout);
    usersRouter.post('/userSession', usersController.userData);
    usersRouter.post('/changePasswordEmail', usersController.sendChangePasswordEmail);
    usersRouter.post('/changePassword', usersController.changePassword);
    usersRouter.use('/mercadoPagoWebHooks', usersController.MercadoPagoWebhooks);
    usersRouter.get('/query', usersController.getUserByQuery);
    usersRouter.post('/newCollection', usersController.createColection);
    usersRouter.post('/addToCollection', usersController.addToColection);
    usersRouter.post('/follow', usersController.followUser);
    usersRouter.post('/process_payment', usersController.processPayment);
    usersRouter.post('/getPreferenceId', usersController.getPreferenceId);
    usersRouter.post('/sendValidationEmail', usersController.sendValidationEmail);
    usersRouter.get('/validateUser/:token', usersController.userValidation);
    usersRouter.get('/balance/:userId', usersController.getBalance);
    usersRouter.get('/c/:userId', usersController.getEmailById); // R
    usersRouter.get('/:userId/photoAndName', usersController.getPhotoAndNameUser); // R
    usersRouter.get('/:userId', usersController.getUserById); // R
    usersRouter.patch('/:userId', upload.single('images'), usersController.updateUser); // U
    usersRouter.delete('/:userId', usersController.deleteUser);
    return usersRouter;
};
