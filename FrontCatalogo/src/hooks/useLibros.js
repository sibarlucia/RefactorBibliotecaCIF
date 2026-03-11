import { useState, useEffect } from 'react';
import axios from 'axios';

const useLibros = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      // Use relative path to work with Vite proxy
      const response = await axios.get('/libros');
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return { data, loading, error, refreshData };
};

export default useLibros;
