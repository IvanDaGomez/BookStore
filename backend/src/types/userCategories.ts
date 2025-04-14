const roleArr = ['vendedor', 'usuario', 'admin'] as const;
type RoleType = typeof roleArr[number];
const estadoCuentaArr = ['Activo', 'Suspendido', 'Vacaciones', 'Inactivo'] as const;
type EstadoCuentaType = typeof estadoCuentaArr[number];

const loginArr = ['Google', 'Facebook', 'Twitter', 'Email', 'default'] as const;
type LoginType = typeof loginArr[number];
export {
    roleArr, RoleType,
    estadoCuentaArr, EstadoCuentaType,
    loginArr, LoginType
}