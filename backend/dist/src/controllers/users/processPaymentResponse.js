import { createEmail } from '../../assets/email/htmlEmails.js';
import { sendEmail } from '../../assets/email/sendEmail.js';
import { createNotification } from '../../assets/notifications/createNotification.js';
import { sendNotification } from '../../assets/notifications/sendNotification.js';
import { BooksModel } from '../../models/books/local/booksLocal.js';
import { TransactionsModel } from '../../models/transactions/local/transactionsModel.js';
import { UsersModel } from '../../models/users/local/usersLocal.js';
// TODO: No esta correcta la lógica
async function processPaymentResponse({ result, sellerId, book, data, res }) {
    try {
        const existingTransaction = await TransactionsModel.getTransactionById(result.id);
        if (existingTransaction) {
            console.log('Transacción ya procesada:', result.id);
            return res.json({
                status: 'success',
                message: 'Pago ya procesado previamente.',
                id: result.id,
                paymentDetails: result.paymentDetails
            });
        }
        // Registrar la transacción (éxito o fracaso)
        if (result.success) {
            await TransactionsModel.createSuccessfullTransaction(result);
        }
        else {
            TransactionsModel.createFailureTransaction(result);
        }
        const user = await UsersModel.getUserById(sellerId);
        // Procesar transacciones exitosas
        if (result.success) {
            const [updatedBook, updatedUser] = await Promise.all([
                BooksModel.updateBook(book._id, { disponibilidad: 'Vendido' }),
                UsersModel.updateUser(sellerId, {
                    librosVendidos: (book.librosVendidos || 0) + 1,
                    balance: { porLlegar: (user?.balance?.porLlegar || 0) + data.transaction_amount }
                })
            ]);
            if (!updatedBook || !updatedUser) {
                throw new Error('El libro o usuario no pudo actualizarse');
            }
            // Crear y enviar correos y notificaciones para ventas exitosas
            const correo = await UsersModel.getEmailById(sellerId);
            const emailPromises = [
                // Enviar correos al comprador y vendedor
                data.payer.email && sendEmail(data.payer.email, 'Comprobante de pago en Meridian', createEmail(result, 'paymentDoneBill')),
                data.payer.email && sendEmail(data.payer.email, '¡Gracias por tu compra!', createEmail(result, 'paymentDoneThank')),
                sendEmail(correo.correo, '¡Tu libro ha sido vendido con éxito!', createEmail({ ...book, fecha: result.paymentDetails.createdIn }, 'bookSold'))
            ].filter(Boolean); // Eliminar valores falsos (en caso de que el email del comprador no exista)
            const notificationPromises = [
                sendNotification(createNotification(book, 'bookSold'))
            ];
            // Ejecutar correos y notificaciones en paralelo
            await Promise.all([...emailPromises, ...notificationPromises]);
            return {
                status: 'success',
                message: 'Pago procesado exitosamente!',
                id: result._id,
                paymentDetails: result.paymentDetails
            };
        }
        // Manejar pagos no exitosos
        if (data.payment_method_id === 'efecty' && data.payer.email) {
            await sendEmail(data.payer.email, 'Información de tu pago en Efecty', createEmail(result, 'efectyPendingPayment'));
        }
        // Respuesta cuando el pago no ha tenido éxito
        return {
            status: result.status,
            message: 'Pago pendiente o rechazado!',
            id: result._id,
            paymentDetails: result.paymentDetails
        };
    }
    catch (error) {
        throw new Error(`Error al procesar la respuesta del pago: ${error.message}`);
    }
}
export { processPaymentResponse };
