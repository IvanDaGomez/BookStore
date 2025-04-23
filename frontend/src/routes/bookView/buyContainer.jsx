/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { handleFavoritos } from "../../assets/handleFavoritos";
import useRelatedBooksBySeller from "./useFetchLibrosRelacionadosVendedor";
import { MakeSmallCard } from "../../assets/makeCard";

export default function BuyContainer({ libro, user }) {
  const librosRelacionadosVendedor = useRelatedBooksBySeller(libro)

  return (<>
  <div className='comprarContainer'>
              {(libro.disponibilidad == 'Disponible')
                ? <>
                  <h2 style={{ color: '#228B22' }}>Disponible</h2>
  
                  {(libro)
                    && <><Link to={`/checkout/${libro._id}`}><button>Comprar ahora</button></Link>
                      <button onClick={(event) => handleFavoritos(event, libro._id, user ? user._id : null)} className='botonInverso'>Agregar a favoritos</button>
                    </>
                    }
                </>
                : <>{libro.disponibilidad}</>}
  
              <p>Vendido por:</p>
              <Link to={`/usuarios/${libro.idVendedor}`}><span>{libro.vendedor}</span></Link>
              <hr />
              <div className='separarConFoto'>
  
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#228B22' fill='none'><path d='M12 9C10.8954 9 10 9.67157 10 10.5C10 11.3284 10.8954 12 12 12C13.1046 12 14 12.6716 14 13.5C14 14.3284 13.1046 15 12 15M12 9C12.8708 9 13.6116 9.4174 13.8862 10M12 9V8M12 15C11.1292 15 10.3884 14.5826 10.1138 14M12 15V16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M21 11.1833V8.28029C21 6.64029 21 5.82028 20.5959 5.28529C20.1918 4.75029 19.2781 4.49056 17.4507 3.9711C16.2022 3.6162 15.1016 3.18863 14.2223 2.79829C13.0234 2.2661 12.424 2 12 2C11.576 2 10.9766 2.2661 9.77771 2.79829C8.89839 3.18863 7.79784 3.61619 6.54933 3.9711C4.72193 4.49056 3.80822 4.75029 3.40411 5.28529C3 5.82028 3 6.64029 3 8.28029V11.1833C3 16.8085 8.06277 20.1835 10.594 21.5194C11.2011 21.8398 11.5046 22 12 22C12.4954 22 12.7989 21.8398 13.406 21.5194C15.9372 20.1835 21 16.8085 21 11.1833Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                  <span >Compra protegida</span>
                </div>
                <div>
                  <img src='/Mercado Pago.svg' alt='' />
                  <span>Compra con MercadoPago.</span>
                </div>
                <div>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#228B22' fill='none'><path d='M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z' stroke='currentColor' strokeWidth='1.5' /><path d='M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z' stroke='currentColor' strokeWidth='1.5' /><path d='M14.5 17.5H9.5M15 15.5V7C15 5.58579 15 4.87868 14.5607 4.43934C14.1213 4 13.4142 4 12 4H5C3.58579 4 2.87868 4 2.43934 4.43934C2 4.87868 2 5.58579 2 7V15C2 15.9346 2 16.4019 2.20096 16.75C2.33261 16.978 2.52197 17.1674 2.75 17.299C3.09808 17.5 3.56538 17.5 4.5 17.5M15.5 6.5H17.3014C18.1311 6.5 18.5459 6.5 18.8898 6.6947C19.2336 6.8894 19.4471 7.2451 19.8739 7.95651L21.5725 10.7875C21.7849 11.1415 21.8911 11.3186 21.9456 11.5151C22 11.7116 22 11.918 22 12.331V15C22 15.9346 22 16.4019 21.799 16.75C21.6674 16.978 21.478 17.1674 21.25 17.299C20.9019 17.5 20.4346 17.5 19.5 17.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
                  <span>Envío a nivel nacional</span>
                </div>
              </div>
              <hr />
              <div className='informacionDelVendedor'>
  
                {librosRelacionadosVendedor &&
                        librosRelacionadosVendedor.filter(element => element._id !== libro._id).length !== 0 &&
                        libro && (
                          <>
                            <h2>Productos de {libro.vendedor}: </h2>
                            <div className='sectionsContainer'>
                              {librosRelacionadosVendedor
                                .filter(element => element._id !== libro._id)
                                .map((element, index) =>
                                  user
                                    ? <MakeSmallCard key={index} element={element} index={index} user={user} />
                                    : <MakeSmallCard key={index} element={element} index={index} />)}
                            </div>
                          </>
                )}
              </div>
            </div>
  </>)
}