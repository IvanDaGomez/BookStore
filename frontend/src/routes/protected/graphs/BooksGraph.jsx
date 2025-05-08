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

export default function BooksGraph({ info }) {
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

    const booksPublished = Xaxis.map((month, idx) => {
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      return info.books.filter(book => {
        const bookDate = new Date(book.fecha_publicacion.split('T')[0]);
        return (
          bookDate.getMonth() === targetMonth &&
          bookDate.getFullYear() === targetYear
        );
      }).length;
    }).reverse();


    const booksPurchased = Xaxis.map((month, idx) => {
      const targetDate = new Date(new Date().setMonth(new Date().getMonth() - idx));
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      return info.transactions.filter(transaction => {
        const bookDate = new Date(transaction.response.date_created.split('T')[0]);
        return (
          transaction.response.status === 'approved' &&
          bookDate.getMonth() === targetMonth &&
          bookDate.getFullYear() === targetYear
        );
      }).length
    }).reverse();


    return {
      labels: Xaxis,
      datasets: [
        {
          label: 'Libros publicados',
          data: booksPublished,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
        {
          label: 'Libros vendidos',
          data: booksPurchased,
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
      <h2>Estadísticas libros</h2>
      {data && <Line data={data} />}
      {/* <div className="availableOptions">
        {options.map((option, index) => (
          <button key={index} onClick={() => setActiveOption(option)} className={activeOption === option ? 'active' : ''}>
            {option}
          </button>
        ))}
      </div> */}

      {/* Render the chart */}
      
    </>
  );
}
