
import { useContext, useEffect, useState } from 'react';
import UserGraph from './graphs/UserGraph.jsx'; // Component to display customer registration & login stats
// import BooksGraph from './BooksGraph'; // Component to show number of books published and viewed
// import TransactionsGraph from './TransactionsGraph'; // Component to track transactions
// import SalesGraph from './SalesGraph'; // Component to track earnings and sales
import './protectedStats.css'
import axios from 'axios';
import BooksGraph from './graphs/BooksGraph.jsx';
import TransactionsGraph from './graphs/TransactionsGraph.jsx';
import SalesGraph from './graphs/SalesGraph.jsx';
import Trends from './graphs/trends.jsx';
import { UserContext } from '../../context/userContext.jsx';
import { useReturnIfNoUser } from '../../assets/useReturnIfNoUser.js';
export default function ProtectedStats() {
  const [info, setInfo] = useState({})
  const { user, loading } = useContext(UserContext)
  useReturnIfNoUser(user, loading, true)
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('http://localhost:3030/api/stats');
      if (response.data.error) {
        console.error(response.data.error);
        return;
      }
      setInfo(response.data);
    }
    fetchData();
  }, [])
  return (
    <>
      <section className="stats-section">
        <div className="stat-card">
          
          <UserGraph info={info}/>  {/* Displaying user registration and login stats */}
        </div>

        <div className="stat-card">
          
          <BooksGraph info={info}/> 
        </div>

        <div className="stat-card">
          <TransactionsGraph info={info}/>  
        </div>

        <div className="stat-card">
          <SalesGraph info={info}/>  
        </div> 
        <div className="stat-card trends">
          <Trends info={info} />
        </div>
      </section>
    </>
  );
}
