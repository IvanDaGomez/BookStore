import { UsersModel } from '../../models/users/local/usersLocal.js';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
async function checkEmailExists(email) {
    const correo = await UsersModel.getUserByEmail(email);
    if (correo.correo) {
        throw new Error('El correo ya existe');
    }
}
function initializeDataCreateUser(data) {
    const time = new Date().toISOString();
    data.fechaRegistro = time;
    data.actualizadoEn = time;
    data.validated = false;
    data._id = crypto.randomUUID();
    data.balance = {
        disponible: 0,
        pendiente: 0
    };
    return data;
}
async function processUserUpdate(data, userId, req) {
    if (req.file)
        data.fotoPerfil = req.file.filename;
    if (data.favoritos && data.accion) {
        // TODO
        data.favoritos = await updateUserFavorites(userId, data.accion);
    }
    if (data.correo) {
        await checkEmailExists(data.correo);
        data.validated = false;
    }
    return filterAllowedFields(data);
}
async function updateUserFavorites(userId, accion) {
    const user = await UsersModel.getUserById(userId);
    if (!user)
        throw new Error('Usuario no encontrado');
    let updatedFavorites = user.favoritos || [];
    if (accion === 'agregar' && !updatedFavorites.includes(userId)) {
        updatedFavorites.push(userId);
    }
    else if (accion === 'eliminar') {
        updatedFavorites = updatedFavorites.filter(fav => fav !== userId);
    }
    return updatedFavorites;
}
function filterAllowedFields(data) {
    const allowedFields = [
        'nombre',
        'correo',
        'direccionEnvio',
        'fotoPerfil',
        'contraseña',
        'bio',
        'favoritos'
    ];
    const filteredData = {};
    allowedFields.forEach(key => {
        if (data[key] !== undefined)
            filteredData[key] = data[key];
    });
    filteredData.actualizadoEn = new Date().toISOString();
    return filteredData;
}
function generateAuthToken(user) {
    try {
        const tokenPayload = {
            _id: user._id,
            nombre: user.nombre
        };
        return jwt.sign(tokenPayload, process.env.JWT_SECRET ?? '', {
            expiresIn: '3h'
        });
    }
    catch (error) {
        throw new Error('Error generando el token');
    }
}
function setAuthCookie(res, token) {
    res.clearCookie('access_token').cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 3 // 3 horas
    });
}
function jwtPipeline(user, res) {
    const newToken = generateAuthToken(user);
    if (!newToken) {
        throw new Error('Error generando el token');
    }
    setAuthCookie(res, newToken);
}
export { checkEmailExists, initializeDataCreateUser, processUserUpdate, jwtPipeline };
