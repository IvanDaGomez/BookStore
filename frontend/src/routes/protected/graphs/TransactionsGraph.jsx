/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2'; // Import the chart component
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register chart components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TransactionsGraph({ info }) {
  const [options] = useState(['Anual', 'Mensual', 'Semanal']);
  const [activeOption] = useState(options[0]);
  const [data, setData] = useState(null);

  const getData = async () => {
    if (!info) return;

    // Generate X-axis labels (months)
    const Xaxis = Array.from({ length: 12 }).map((_, i) => {
      const date = new Date();
      return new Date(date.getFullYear(), date.getMonth() - i, date.getDate()).toLocaleDateString('es-ES', { month: 'long' });
    }).reverse();

    const transactionsCreated = Xaxis.map((month, idx) => {
      // Calculate target date once per iteration
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();
      return info.transactions.filter(transaction => {
        // console.log(new Date(user.fechaRegistro).toLocaleDateString('es-ES', { month: 'long' }))
        const transactionDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          (transactionDate.getMonth()) === targetMonth &&
          transactionDate.getFullYear() === targetYear
        );
      }).length;
    }).reverse();
    
    const successfulTransactions = Xaxis.map((month, idx) => {
      // Calculate target date once per iteration
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();
      return info.transactions.filter(transaction => {
        // console.log(new Date(user.fechaRegistro).toLocaleDateString('es-ES', { month: 'long' }))
        const transactionDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          transaction.response.status === 'approved' &&
          (transactionDate.getMonth()) === targetMonth &&
          transactionDate.getFullYear() === targetYear
        );
      }).length;
    }).reverse();
    const failureTransactions = Xaxis.map((month, idx) => {
      // Calculate target date once per iteration
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();
      return info.transactions.filter(transaction => {
        // console.log(new Date(user.fechaRegistro).toLocaleDateString('es-ES', { month: 'long' }))
        const transactionDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          transaction.response.status !== 'approved' &&
          (transactionDate.getMonth()) === targetMonth &&
          transactionDate.getFullYear() === targetYear
        );
      }).length;
    }).reverse();
    return {
      labels: Xaxis,
      datasets: [
        {
          label: 'Transacciones publicadas',
          data: transactionsCreated,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Transacciones exitosas',
          data: successfulTransactions,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Transacciones fallidas',
          data: failureTransactions,
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
        },
        // {
        //   label: 'Transacciones añadidas a favoritos',
        //   data: transactionsFavorites,
        //   borderColor: 'rgb(153, 102, 255)',
        //   backgroundColor: 'rgba(153, 102, 255, 0.5)',
        // }
      ]
    };
  };

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

  return (
    <>
      <h2>Estadísticas transacciones</h2>
      {/* Render the chart */}
      {data && <Line data={data} />}
      {/* <div className="availableOptions">
        {options.map((option, index) => (
          <button key={index} onClick={() => setActiveOption(option)} className={activeOption === option ? 'active' : ''}>
            {option}
          </button>
        ))}
      </div> */}

      
    </>
  );
}
