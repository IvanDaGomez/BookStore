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

export default function SalesGraph({ info }) {
  const [options] = useState(['Anual', 'Mensual', 'Semanal']);
  const [activeOption, setActiveOption] = useState(options[0]);
  const [data, setData] = useState(null);

  const getData = async () => {
    if (!info) return;

    // Generate X-axis labels (months)
    const Xaxis = Array.from({ length: 12 }).map((_, i) => {
      const date = new Date();
      return new Date(date.getFullYear(), date.getMonth() - i, date.getDate()).toLocaleDateString('es-ES', { month: 'long' });
    }).reverse();


    const earnings = Xaxis.map((month, idx) => {
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      return info.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          transaction.response.status === 'approved' &&
          transactionDate.getMonth() === targetMonth &&
          transactionDate.getFullYear() === targetYear
        );
      }).reduce((total, next) => total + (next?.response.transaction_amount ?? 0), 0); // Sum of views for each sale
    }).reverse();

    const profit = Xaxis.map((month, idx) => {
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      return info.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          transaction.response.status === 'approved' &&
          transactionDate.getMonth() === targetMonth &&
          transactionDate.getFullYear() === targetYear
        );
      }).reduce((total, next) => total + 
      next.response.fee_details.filter((t) => t.type === 'application_fee')[0].amount
      - next.response.charges_details[0].amounts.original , 0); // Sum of views for each sale
    }).reverse();

    const MercadoPagoComission = Xaxis.map((month, idx) => {
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      return info.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          transaction.response.status === 'approved' &&
          transactionDate.getMonth() === targetMonth &&
          transactionDate.getFullYear() === targetYear
        );
      }).reduce((total, next) => total + 
      next.response.charges_details[0].amounts.original , 0); // Sum of views for each sale
    }).reverse();
    return {
      labels: Xaxis,
      datasets: [
        {
          label: 'Ingresos totales',
          data: earnings,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Ganancias',
          data: profit,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Comisión MercadoPago',
          data: MercadoPagoComission,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Gastos de envío',
          data: Array.from({ length: Xaxis.length }).map(() => 0),
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
        }
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
      <h2>Estadísticas ventas</h2>
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
