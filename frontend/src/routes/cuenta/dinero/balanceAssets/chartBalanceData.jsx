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

// eslint-disable-next-line react/prop-types
export default function ChartBalanceData ({ transactions, user }) {
  const [days] = useState(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'])
  const [months] = useState(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])
  const [semanal, setSemanal] = useState([])
  const [mensual, setMensual] = useState([])

  const [Xaxis, setXaxis] = useState([])
  useEffect(() => {
    const date = new Date()
    setSemanal(Array.from({ length: 7 }).map((_, i) => {
      return days[(date.getDay() + i) % 7]
    }
    ))
    setMensual(Array.from({ length: 12 }).map((_, i) => {
      return months[(date.getMonth() + i) % 12]
    }).reverse())


  },[days, months])
  useEffect(() => setXaxis(semanal), [semanal])



  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'top'
      }
    }
  }
  const [data, setData] = useState(null)
  

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData({ Xaxis, transactions, user })
      if (result && result.labels && result.datasets) {
        setData(result)
      } else {
        console.error('Error: Datos inválidos', result)
      }
    }
    fetchData()
  }, [Xaxis, transactions, user])
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

        </div>
      </div>
    </>
  )
}
