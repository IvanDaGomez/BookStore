/* eslint-disable react/prop-types */
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

export default function UserGraph({ info }) {
  /*
  Key points to track:
  - Number of users registered
  - Number of users logged in
  - Number of users who have purchased books
  */
  const [options] = useState(['Anual', 'Mensual', 'Semanal'])
  const [activeOption, setActiveOption] = useState(options[0]);
  const [data, setData] = useState(null)
  const getData = async () => {
    if (!info || !info?.users) return
    const Xaxis = Array.from({ length: 12 }).map((_, i) => {
      const date = new Date()
      return new Date(date.getFullYear(), date.getMonth() - i, date.getDate()).toLocaleDateString('es-ES', { month: 'long' })
    }
    ).reverse()

    const registeredUsers = Xaxis.map((month, idx) => {
      // Calculate target date once per iteration
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();
      return info.users.filter(user => {
        // console.log(new Date(user.fechaRegistro).toLocaleDateString('es-ES', { month: 'long' }))
        const userDate = new Date(user.fechaRegistro.split('T')[0]);
        return (
          (userDate.getMonth()) === targetMonth &&
          userDate.getFullYear() === targetYear
        );
      }).length;
    }).reverse();
    // const loggedInUsers = []

    const usersWhoBoughtBooks = Xaxis.map((_, idx) => {
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));

      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      return (info?.users ?? []).filter(user => {
        const userDate = new Date(user.fechaRegistro.split('T')[0]);
        return (
          (user?.comprasIds ?? []).length > 0 &&
          userDate.getMonth() === targetMonth &&
          userDate.getFullYear() === targetYear
        );
      }).length;
    }).reverse()
    return {
      labels: Xaxis,
      datasets: [
        {
          label: 'Usuarios registrados',
          data: registeredUsers,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        // {
        //   label: 'Usuarios que han iniciado sesión',
        //   data: loggedInUsers,
        //   borderColor: 'rgb(255, 99, 132)',
        //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
        // },
        {
          label: 'Usuarios que han comprado libros',
          data: usersWhoBoughtBooks,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        }
      ]
    }
  }
  useEffect(() => {
    
    const fetchData = async () => {
      if (Object.keys(info).length === 0) {
        return
      }
      const data = await getData()
      setData(data)
    }
    fetchData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOption, info])
 return (<>

<h2>Estadísticas usuarios</h2>
  {data && <Line data={data} />}
 {/* <div className="availableOptions">
  {options.map((option, index) => (
    <button key={index} onClick={() => setActiveOption(option)} className={activeOption === option ? 'active' : ''}>
      {option}
    </button>))}
    </div> */}
 </>)
}