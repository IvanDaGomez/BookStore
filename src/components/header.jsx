import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Header() {

    const abrirMenu = () => {
        let menu = document.querySelector(".inhamburger");
        let x = document.querySelector(".cerrar");
        let hamburguer = document.querySelector(".abrir");
        if (menu.style.display === "none" || menu.style.display === "") {
            x.style.display = "block";
            hamburguer.style.display = "none";
            menu.style.display = "flex";
            menu.style.height = "0px";
            menu.style.animationName = "agrandar";
            menu.style.animationPlayState = "running";
            menu.addEventListener("animationend", function handler() {
                menu.style.animationPlayState = "paused";
                menu.style.height = "calc(60vh + 7px)";
                menu.removeEventListener("animationend", handler);
            });
        } else {
            x.style.display = "none";
            hamburguer.style.display = "block";
            menu.style.animationName = "reducir";
            menu.style.animationPlayState = "running";
            menu.addEventListener("animationend", function handler() {
                menu.style.display = "none";
                menu.style.height = "0px";
                menu.removeEventListener("animationend", handler);
            });
        }
    };

    const [arrayInfo, setArrayInfo] = useState(null);

    const openExtraInfo = async (str) => {
        const response = await fetch("../assets/extraInfo.json");
        const info = await response.json();
        setArrayInfo(info[str]);
    };

    return (
        <>
            <div className="antesHeader" style={{ color: "#000000" }}>
                <h1>Descubre nuestras ofertas</h1>
            </div>
            <header>
                <div className="headerIzq">
                    <Link to="/"><img src="/logo.png" alt="" /></Link>
                </div>

                <div className="indice headerCen desaparecer">
                    <Link to="/"><p>Inicio</p></Link>
                    <p  onMouseOver={() => openExtraInfo("Libros")} onMouseLeave={() => setArrayInfo(null)}>Libros</p>
                    <p onMouseOver={() => openExtraInfo("Autores")}>Autores</p>
                    <p onMouseOver={() => openExtraInfo("Contacto")}>Contacto</p>
                </div>

                <div className="headerDer">
                    <div className="imagesGrid">
                        <a href="https://www.facebook.com/VoleiColombia" target="_blank">
                            <div className="socialContainer facebook">
                                {/* Social icons */}
                            </div>
                        </a>
                        {/* Add other social links */}
                    </div>
                </div>

                {/* Conditional rendering for arrayInfo */}
                {arrayInfo && (
                    <div className="extraInfo">
                        {arrayInfo.map((element, index) => (
                            <p key={index}>{element}</p>
                        ))}
                    </div>
                )}
            </header>

            <div className="inhamburger" onMouseLeave={abrirMenu}>
                {/* Hamburger menu content */}
            </div>
        </>
    );
}
