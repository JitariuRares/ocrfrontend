import React, { useState } from 'react';

function AddParkingPage() {
  const [plateNumber, setPlateNumber] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessData(null);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/parking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          entryTime,
          exitTime,
          licensePlate: {
            plateNumber
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessData(data);
        setPlateNumber('');
        setEntryTime('');
        setExitTime('');
      } else {
        setError('A apărut o eroare la salvarea parcării.');
      }
    } catch (err) {
      setError('Eroare de rețea.');
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Adaugă Istoric de Parcare</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          placeholder="Număr plăcuță"
          className="file-input"
          required
        />
        <input
          type="datetime-local"
          value={entryTime}
          onChange={(e) => setEntryTime(e.target.value)}
          className="file-input"
          required
        />
        <input
          type="datetime-local"
          value={exitTime}
          onChange={(e) => setExitTime(e.target.value)}
          className="file-input"
        />
        <button type="submit" className="primary-btn">Salvează</button>
      </form>

      {successData && (
        <div className="alert alert-success">
          Parcarea a fost salvată cu ID: {successData.id}
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
    </div>
  );
}

export default AddParkingPage;
