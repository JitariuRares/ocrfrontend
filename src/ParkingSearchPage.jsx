import React, { useState } from 'react';

function ParkingSearchPage() {
  const [plateNumber, setPlateNumber] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);

    try {
      const response = await fetch(`http://localhost:8080/api/parking/${plateNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setError('Nu s-a găsit niciun istoric pentru această plăcuță.');
      }
    } catch (err) {
      setError('Eroare de rețea.');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Caută Istoric de Parcare</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="Număr plăcuță"
          className="file-input"
          required
        />
        <button type="submit" className="primary-btn">Caută</button>
      </form>

      {error && <div className="alert alert-error mt-4">{error}</div>}

      {results.length > 0 && (
        <div className="mt-6 table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Intrare</th>
                <th>Ieşire</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.entryTime?.replace('T', ' ')}</td>
                  <td>{r.exitTime?.replace('T', ' ') || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ParkingSearchPage;
