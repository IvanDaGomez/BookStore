import { renderProfilePhoto } from '../../assets/renderProfilePhoto'

/* eslint-disable react/prop-types */
export default function Perfil ({ user, navigate }) {
  const svgHeight = 40
  const options = [{
    name: 'Notificaciones',
    icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={svgHeight} height={svgHeight} color='#000000' fill='none'>
      <path d='M8.73047 21.499C10.0226 19.276 12.9819 19.0139 14.6673 20.7126C15.0441 21.0924 15.2325 21.2824 15.3996 21.3051C15.5667 21.3278 16.6152 20.7265 16.9874 20.5131C17.3668 20.2956 18.4187 19.6922 18.4848 19.5344C18.5509 19.3765 18.4817 19.1074 18.3433 18.5692C17.8399 16.6121 19.0606 14.5524 21.011 14.0212C21.5329 13.879 21.7938 13.8079 21.8969 13.672C22 13.5361 22 12.3409 22 11.9036C22 11.4664 22 10.2711 21.8969 10.1352C21.7938 9.9993 21.5329 9.92819 21.011 9.78607C19.0603 9.25481 17.8386 7.19517 18.3418 5.23798C18.4801 4.69968 18.5493 4.43053 18.4832 4.27271C18.4171 4.1149 17.3652 3.51159 16.9859 3.29406C16.6136 3.0806 15.5651 2.47932 15.3981 2.50204C15.231 2.52478 15.0426 2.71467 14.6657 3.09447C13.2064 4.56489 10.792 4.56495 9.33276 3.09456C8.95585 2.71477 8.76739 2.52487 8.60035 2.50215C8.4333 2.47942 7.38483 3.08071 7.0126 3.29418C6.63327 3.51172 5.58126 4.11501 5.51516 4.27285C5.44907 4.43069 5.51829 4.6998 5.65672 5.23805C6.16008 7.19518 4.9394 9.25477 2.98902 9.78605C2.46711 9.92819 2.20615 9.9993 2.10308 10.1353C2 10.2711 2 11.4664 2 11.9036C2 12.3409 2 13.5361 2.10308 13.6721C2.20617 13.808 2.467 13.879 2.98866 14.0211C2.99478 14.0228 3.00089 14.0245 3.007 14.0261' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      <path d='M2.48891 18.1828C3.56891 17.1033 7.24091 13.4688 7.60091 13.0489C7.98148 12.6051 7.67291 12.0054 7.85651 10.1461C7.94535 9.24652 8.13895 8.57254 8.69291 8.071C9.35291 7.44726 9.89291 7.44726 11.7529 7.40527C13.3729 7.44726 13.5649 7.26733 13.7329 7.68716C13.8529 7.98704 13.4929 8.16696 13.0609 8.64677C12.1009 9.60637 11.5369 10.0862 11.4829 10.3861C11.0929 11.7055 12.6289 12.4852 13.4689 11.6455C13.7866 11.328 15.2569 9.84627 15.4009 9.72632C15.5089 9.63036 15.7674 9.635 15.8929 9.78629C16.0009 9.89235 16.0129 9.90624 16.0009 10.386C15.9898 10.8302 15.9948 11.4678 15.9961 12.1253C15.9979 12.9773 15.9529 13.9246 15.5929 14.4044C14.8729 15.4839 13.6729 15.5439 12.5929 15.5919C11.5729 15.6519 10.7329 15.5439 10.4689 15.7358C10.2529 15.8438 9.11291 17.0433 7.73291 18.4227L5.27291 20.8817C3.23291 22.5011 0.988911 19.9821 2.48891 18.1828Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
          </svg>,
    href: '/cuenta/preferencias-notificaciones',
    description: 'Edita las preferencias de tus notificaciones'
  }, {
    name: 'Mis compras',
    icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={svgHeight} height={svgHeight} color='#000000' fill='none'>
      <path d='M3.06164 15.1933L3.42688 13.1219C3.85856 10.6736 4.0744 9.44952 4.92914 8.72476C5.78389 8 7.01171 8 9.46734 8H14.5327C16.9883 8 18.2161 8 19.0709 8.72476C19.9256 9.44952 20.1414 10.6736 20.5731 13.1219L20.9384 15.1933C21.5357 18.5811 21.8344 20.275 20.9147 21.3875C19.995 22.5 18.2959 22.5 14.8979 22.5H9.1021C5.70406 22.5 4.00504 22.5 3.08533 21.3875C2.16562 20.275 2.4643 18.5811 3.06164 15.1933Z' stroke='currentColor' strokeWidth='1.5' />
      <path d='M7.5 8L7.66782 5.98618C7.85558 3.73306 9.73907 2 12 2C14.2609 2 16.1444 3.73306 16.3322 5.98618L16.5 8' stroke='currentColor' strokeWidth='1.5' />
      <path d='M15 11C14.87 12.4131 13.5657 13.5 12 13.5C10.4343 13.5 9.13002 12.4131 9 11' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
          </svg>,
    href: '/cuenta/mis-compras',
    description: 'Encuentra el historial de compras'
  }, {
    name: 'Mis ventas',
    icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={svgHeight} height={svgHeight} color='#000000' fill='none'>
      <path d='M19.7453 13C20.5362 11.8662 21 10.4872 21 9C21 5.13401 17.866 2 14 2C10.134 2 7 5.134 7 9C7 10.0736 7.24169 11.0907 7.67363 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M14 6C12.8954 6 12 6.67157 12 7.5C12 8.32843 12.8954 9 14 9C15.1046 9 16 9.67157 16 10.5C16 11.3284 15.1046 12 14 12M14 6C14.8708 6 15.6116 6.4174 15.8862 7M14 6V5M14 12C13.1292 12 12.3884 11.5826 12.1138 11M14 12V13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      <path d='M3 14H5.39482C5.68897 14 5.97908 14.0663 6.24217 14.1936L8.28415 15.1816C8.54724 15.3089 8.83735 15.3751 9.1315 15.3751H10.1741C11.1825 15.3751 12 16.1662 12 17.142C12 17.1814 11.973 17.2161 11.9338 17.2269L9.39287 17.9295C8.93707 18.0555 8.449 18.0116 8.025 17.8064L5.84211 16.7503M12 16.5L16.5928 15.0889C17.407 14.8352 18.2871 15.136 18.7971 15.8423C19.1659 16.3529 19.0157 17.0842 18.4785 17.3942L10.9629 21.7305C10.4849 22.0063 9.92094 22.0736 9.39516 21.9176L3 20.0199' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>,
    href: '/cuenta/mis-ventas',
    description: 'Encuentra el historial de ventas',
    condition: user?.rol !== 'Vendedor'
  }, {
    name: 'Mi balance',
    icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={svgHeight} height={svgHeight} color='#000000' fill='none'>
      <path d='M13 5C17.9706 5 22 8.35786 22 12.5C22 14.5586 21.0047 16.4235 19.3933 17.7787C19.1517 17.9819 19 18.2762 19 18.5919V21H17L16.2062 19.8674C16.083 19.6916 15.8616 19.6153 15.6537 19.6687C13.9248 20.1132 12.0752 20.1132 10.3463 19.6687C10.1384 19.6153 9.91703 19.6916 9.79384 19.8674L9 21H7V18.6154C7 18.2866 6.83835 17.9788 6.56764 17.7922C5.49285 17.0511 2 15.6014 2 14.0582V12.5C2 11.9083 2.44771 11.4286 3 11.4286C3.60665 11.4286 4.10188 11.1929 4.30205 10.5661C5.32552 7.36121 8.83187 5 13 5Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
      <path d='M14.5 8C13.868 7.67502 13.1963 7.5 12.5 7.5C11.8037 7.5 11.132 7.67502 10.5 8' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M7.49981 11H7.50879' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M21 8.5C21.5 8 22 7.06296 22 5.83053C22 4.26727 20.6569 3 19 3C18.6494 3 18.3128 3.05676 18 3.16106' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
          </svg>,
    href: '/cuenta/balance',
    description: 'Encuentra tu dinero y el historial de transacciones'
  }, /* {
        name: 'Preferencias del comprador',
        href: '/cuenta/preferencias-comprador',
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={svgHeight} height={svgHeight} color={"#000000"} fill={"none"}>
        <path d="M5.18007 15.2964C3.92249 16.0335 0.625213 17.5386 2.63348 19.422C3.6145 20.342 4.7071 21 6.08077 21H13.9192C15.2929 21 16.3855 20.342 17.3665 19.422C19.3748 17.5386 16.0775 16.0335 14.8199 15.2964C11.8709 13.5679 8.12906 13.5679 5.18007 15.2964Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 7C14 9.20914 12.2091 11 10 11C7.79086 11 6 9.20914 6 7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 5.625V3.75C20.5714 3.75 19.5 3 19.5 3C19.5 3 18.4286 3.75 17 3.75V5.625C17 8.25 19.5 9 19.5 9C19.5 9 22 8.25 22 5.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
        description: 'Edita las preferencias que tienes como comprador'
    },{
        name: 'Preferencias del vendedor',
        href: '/cuenta/preferencias-vendedor',
        description: 'Edita las preferencias que tienes como vendedor',
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={svgHeight} height={svgHeight} color={"#000000"} fill={"none"}>
        <path d="M16.3083 4.38394C15.7173 4.38394 15.4217 4.38394 15.1525 4.28405C15.1151 4.27017 15.0783 4.25491 15.042 4.23828C14.781 4.11855 14.5721 3.90959 14.1541 3.49167C13.1922 2.52977 12.7113 2.04882 12.1195 2.00447C12.04 1.99851 11.96 1.99851 11.8805 2.00447C11.2887 2.04882 10.8077 2.52977 9.84585 3.49166C9.42793 3.90959 9.21897 4.11855 8.95797 4.23828C8.92172 4.25491 8.88486 4.27017 8.84747 4.28405C8.57825 4.38394 8.28273 4.38394 7.69171 4.38394H7.58269C6.07478 4.38394 5.32083 4.38394 4.85239 4.85239C4.38394 5.32083 4.38394 6.07478 4.38394 7.58269V7.69171C4.38394 8.28273 4.38394 8.57825 4.28405 8.84747C4.27017 8.88486 4.25491 8.92172 4.23828 8.95797C4.11855 9.21897 3.90959 9.42793 3.49166 9.84585C2.52977 10.8077 2.04882 11.2887 2.00447 11.8805C1.99851 11.96 1.99851 12.04 2.00447 12.1195C2.04882 12.7113 2.52977 13.1922 3.49166 14.1541C3.90959 14.5721 4.11855 14.781 4.23828 15.042C4.25491 15.0783 4.27017 15.1151 4.28405 15.1525C4.38394 15.4217 4.38394 15.7173 4.38394 16.3083V16.4173C4.38394 17.9252 4.38394 18.6792 4.85239 19.1476C5.32083 19.6161 6.07478 19.6161 7.58269 19.6161H7.69171C8.28273 19.6161 8.57825 19.6161 8.84747 19.7159C8.88486 19.7298 8.92172 19.7451 8.95797 19.7617C9.21897 19.8815 9.42793 20.0904 9.84585 20.5083C10.8077 21.4702 11.2887 21.9512 11.8805 21.9955C11.96 22.0015 12.04 22.0015 12.1195 21.9955C12.7113 21.9512 13.1922 21.4702 14.1541 20.5083C14.5721 20.0904 14.781 19.8815 15.042 19.7617C15.0783 19.7451 15.1151 19.7298 15.1525 19.7159C15.4217 19.6161 15.7173 19.6161 16.3083 19.6161H16.4173C17.9252 19.6161 18.6792 19.6161 19.1476 19.1476C19.6161 18.6792 19.6161 17.9252 19.6161 16.4173V16.3083C19.6161 15.7173 19.6161 15.4217 19.7159 15.1525C19.7298 15.1151 19.7451 15.0783 19.7617 15.042C19.8815 14.781 20.0904 14.5721 20.5083 14.1541C21.4702 13.1922 21.9512 12.7113 21.9955 12.1195C22.0015 12.04 22.0015 11.96 21.9955 11.8805C21.9512 11.2887 21.4702 10.8077 20.5083 9.84585C20.0904 9.42793 19.8815 9.21897 19.7617 8.95797C19.7451 8.92172 19.7298 8.88486 19.7159 8.84747C19.6161 8.57825 19.6161 8.28273 19.6161 7.69171V7.58269C19.6161 6.07478 19.6161 5.32083 19.1476 4.85239C18.6792 4.38394 17.9252 4.38394 16.4173 4.38394H16.3083Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 16.5C9.19863 15.2923 10.5044 14.4797 12 14.4797C13.4956 14.4797 14.8014 15.2923 15.5 16.5M14 10C14 11.1046 13.1046 12 12 12C10.8955 12 10 11.1046 10 10C10 8.89544 10.8955 8.00001 12 8.00001C13.1046 8.00001 14 8.89544 14 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>,
        condition: !(user?.rol === 'Vendedor')
    } */{
    name: 'Direcciones',
    icon: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={svgHeight} height={svgHeight} color='#000000' fill='none'>
      <path d='M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z' stroke='currentColor' strokeWidth='1.5' />
      <path d='M18.2222 17C19.6167 18.9885 20.2838 20.0475 19.8865 20.8999C19.8466 20.9854 19.7999 21.0679 19.7469 21.1467C19.1724 22 17.6875 22 14.7178 22H9.28223C6.31251 22 4.82765 22 4.25311 21.1467C4.20005 21.0679 4.15339 20.9854 4.11355 20.8999C3.71619 20.0475 4.38326 18.9885 5.77778 17' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
      <path d='M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z' stroke='currentColor' strokeWidth='1.5' />
          </svg>,
    href: '/cuenta/direcciones',
    description: 'Direcciones guardadas en tu cuenta'
  }]
  return (
    <>
      <h1>Perfil</h1>
      <div className='userInfo'>
        <img src={renderProfilePhoto({ user })} alt={user?.nombre} />
        <div>
          <h2>{user.nombre}</h2>
          <h3>{user.correo}</h3>
          <button onClick={() => navigate('/usuarios/editarUsuario')}>
            Editar perfil
          </button>
          {(user && !user?.validated) && <a href='/verificar'><button className='botonInverso'>No verificado</button></a>}
        </div>
      </div>
      <div className='userExtraInfo'>
        {options.filter(option => !option?.condition).map((option, index) => (
          <a href={option.href} key={index} style={{ width: '100%' }}>
            <div className='box' key={index}>
              <div className='iconContainer'>
                {option.icon}
              </div>
              <div className='boxDescription'>
                <h2>{option.name}</h2>
                <h3>{option.description}</h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}
