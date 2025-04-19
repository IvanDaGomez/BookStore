import { validateTransaction } from '../../assets/validate.js';
export class TransactionsController {
    constructor({ TransactionsModel }) {
        // Obtener todas las transacciones
        this.getAllTransactions = async (req, res) => {
            try {
                const transactions = await this.TransactionsModel.getAllTransactions();
                if (!transactions) {
                    res.status(500).json({ error: 'Error al leer las transacciones' });
                }
                res.json(transactions);
            }
            catch (err) {
                console.error('Error al leer las transacciones:', err);
                res.status(500).json({ error: 'Error al leer las transacciones' });
            }
        };
        this.getTransactionsByUser = async (req, res) => {
            try {
                const { userId } = req.params;
                const transaction = await this.TransactionsModel.getTransactionsByUser(userId);
                if (!transaction) {
                    return res.status(404).json({ error: 'Conversación no encontrada' });
                }
                res.json({ transaction });
            }
            catch (err) {
                console.error('Error al leer el usuario:', err);
                res.status(500).json({ error: 'Error al leer el usuario' });
            }
        };
        this.getTransactionById = async (req, res) => {
            try {
                const { transactionId } = req.params;
                const transaction = await this.TransactionsModel.getTransactionById(transactionId);
                if (!transaction) {
                    return res.status(404).json({ error: 'Transacción no encontrada' });
                }
                res.json({ transaction });
            }
            catch (err) {
                console.error('Error al leer la transacción:', err);
                res.status(500).json({ error: 'Error al leer la transacción' });
            }
        };
        // Filtrar transaccións
        this.createTransaction = async (req, res) => {
            const data = req.body;
            // Validación
            const validated = validateTransaction(data);
            if (!validated.success) {
                console.log('Error de validación:', validated.error);
                return res.status(400).json({ error: validated.error });
            }
            // Asignar un ID único al transacción
            data._id = crypto.randomUUID();
            const time = new Date();
            data.createdIn = time;
            let transaction;
            // Crear el transacción en la base de datos
            if (data.status === 'approved') {
                transaction = await this.TransactionsModel.createSuccessfullTransaction(data);
            }
            else {
                transaction = await this.TransactionsModel.createFailureTransaction(data);
            }
            if (typeof transaction === 'string' && transaction.startsWith('Error')) {
                return res.status(500).json({ error: transaction });
            }
            if (!transaction) {
                return res.status(500).json({ error: 'Error al crear transacción' });
            }
            // Si todo es exitoso, devolver el transacción creado
            res.send({ transaction });
        };
        this.deleteTransaction = async (req, res) => {
            try {
                const { transactionId } = req.params;
                // Obtener los detalles del transacción para encontrar al vendedor (idVendedor)
                const transaction = await this.TransactionsModel.getTransactionById(transactionId);
                if (!transaction) {
                    return res.status(404).json({ error: 'Transacción no encontrada' });
                }
                // Eliminar el transacción de la base de datos
                const result = await this.TransactionsModel.deleteTransaction(transactionId);
                if (!result) {
                    return res.status(404).json({ error: 'Transacción no encontrada' });
                }
                res.json({ transaction: 'Transacción eliminada con éxito' });
            }
            catch (err) {
                console.error('Error al eliminar la transacción:', err);
                res.status(500).json({ error: 'Error al eliminar la transacción' });
            }
        };
        this.TransactionsModel = TransactionsModel;
    }
}
