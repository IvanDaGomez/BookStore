import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { getData } from './getData'
import { useEffect, useState } from 'react'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ChartBalanceData () {
  const semanal = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  const mensual = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

  // Generar un arreglo dinámico para los próximos 10 años a partir del año actual
  const currentYear = new Date().getFullYear()
  const anual = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse()

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'top'
      }
    }
  }
  const [data, setData] = useState(null)
  const [Xaxis, setXaxis] = useState(semanal)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData({ Xaxis })
      if (result && result.labels && result.datasets) {
        setData(result)
      } else {
        console.error('Error: Datos inválidos', result)
      }
    }
    fetchData()
  }, [Xaxis])
  return (
    <>
      <div className='chartBalance'>
        {data && <Line options={options} data={data} />}
        <div className='axisPicker'>
          <div
            className={`${Xaxis.length === 7 ? 'active' : ''}`}
            onClick={() => setXaxis(semanal)}
          >
            Semanal
          </div>
          <div
            className={`${Xaxis.length === 12 ? 'active' : ''}`}
            onClick={() => setXaxis(mensual)}
          >Mensual
          </div>
          <div
            className={`${(Xaxis.length !== 7 && Xaxis.length !== 12) ? 'active' : ''}`}
            onClick={() => setXaxis(anual)}
          >Anual
          </div>
        </div>
      </div>
    </>
  )
}
