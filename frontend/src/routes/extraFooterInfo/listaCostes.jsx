import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import SideInfo from "../../components/sideInfo";

export default function ListaCostes() {
  return (
    <>
      <Header />
      <div className="extraFooterInfoContainer costs">
        <h1>Lista de Costos</h1>
        <p>
          Si compras o vendes un artículo, utilizas nuestro sistema de pago
          integrado. Al vendedor se le cargará la Comisión 7.99% + $3.999
          (Sujeto a IVA). La tarifa de comisión será deducida del valor de venta
          del artículo e incluye los costes de pago de los servicios + el coste
          por el uso de la plataforma Meridian + el IVA en estos costos.
        </p>
        <h2>Envío Estándar</h2>
        <table>
          <thead>
            <tr>
              <th>Peso</th>
              <th>Precio</th>
              <th>Seguimiento</th>
              <th>Seguro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pequeño (hasta 0,5Kg)</td>
              <td>$8.900</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <td>Mediano (de 0,5Kg a 1Kg)</td>
              <td>$8.900</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <td>Grande (de 1Kg a 3Kg)</td>
              <td>$8.900</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
          </tbody>
        </table>

        <h2>Envío a Zonas Especiales</h2>
        <table>
          <thead>
            <tr>
              <th>Zona</th>
              <th>Peso</th>
              <th>Precio</th>
              <th>Seguimiento</th>
              <th>Seguro</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Zona 1</td>
              <td>de 0Kg a 3Kg</td>
              <td>$30.150 | $8.900 + $21.250 (Suplemento)</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
            <tr>
              <td>Zona 2</td>
              <td>de 0Kg a 3Kg</td>
              <td>$44.650 | $8.900 + $35.750 (Suplemento)</td>
              <td>✔</td>
              <td>✔</td>
            </tr>
          </tbody>
        </table>

        <p>
          Los compradores pagarán por el envío vía Meridian el precio único de
          $8.900 sea cual sea el tamaño del paquete. Para zonas especiales de
          larga distancia, se aplicará un costo adicional (suplemento) indicado
          en la tabla anterior.
        </p>
        <p>
          El paquete no debe superar los 3Kg y la suma de su alto + ancho +
          profundidad NO debe superar los 90cm.
        </p>

        <h2>Costos Adicionales</h2>
        <p>
          Cuando se haya vendido exitosamente un artículo, las ganancias se
          acreditarán en el monedero virtual de la usuaria (Balance). El
          vendedor puede dejar el dinero allí y utilizarlo para compras en
          Meridian o elegir transferirlo a su cuenta bancaria o Daviplata.
        </p>
        <p>
          En el momento de solicitar el cobro de las ventas a su cuenta bancaria
          o Daviplata, se descontarán $1.800 (impuestos incluidos) como coste
          bancario, que se deducirá del monto a transferir por cada cobro.
        </p>
        <p>
          Si uno de los productos vendidos da lugar a una devolución, se
          descontará del balance del vendedor el monto de $9.500 (costo
          logístico) que deberá asumir si: el producto está roto, dañado o
          maltratado; si el producto no es original o si la prenda que se vendió
          no es de la talla anunciada o tiene detalles que no fueron mencionados
          en la publicación.
        </p>
        <p>
          Para los productos vendidos en promoción de “Envíos a $5.000” por
          activación del vendedor, esta asumirá $3.900 del coste logístico.
          Este monto será descontado de las ganancias de el vendedor y no
          constituye comisión, sino ingreso logístico para Meridian.
        </p>

        <h2>Ciudades con Coste Adicional</h2>
        <p>
          <strong>Tarifa Zona 1:</strong> $21.250
        </p>
        <p>
          Amazonas: Puerto Nariño, Antioquia: Abriaqui, Alejandria, Amaga,
          Amalfi, Andes, Angelopolis, Angostura, Anori, Argelia, Armenia, etc.
          (list truncated for brevity).
        </p>
        <p>
          <strong>Tarifa Zona 2:</strong> $35.750
        </p>
        <p>
          Amazonas: Leticia, Archipielago De San Andres: Providencia, San
          Andres, Guainia: Puerto Inirida, Vichada: Puerto Carreño.
        </p>
      </div>
      <SideInfo />
      <Footer />
    </>
  );
}