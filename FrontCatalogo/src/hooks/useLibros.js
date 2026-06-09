import { useState, useEffect } from 'react';
import axios from 'axios';

const useLibros = () => {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    axios
      .get('/api/libros')
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};

export default useLibros;
