// src/InsuranceSearchPage.jsx
import React, { useState } from 'react';

function InsuranceSearchPage() {
  const [plateNumber, setPlateNumber] = useState('');
  const [insuranceList, setInsuranceList] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setInsuranceList([]);

    if (!plateNumber) {
      setError('Introdu un număr de înmatriculare');
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/insurance/${plateNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error('Eroare la căutare');
      }

      const data = await res.json();
      setInsuranceList(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Caută Asigurare după Număr Plăcuță</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Număr plăcuță:</label>
        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Ex: SV15WDC"
        />
      </div>

      <button onClick={handleSearch} className="primary-btn mb-4">Caută</button>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {insuranceList.length > 0 && (
        <div className="bg-green-100 p-4 rounded shadow-md">
          <h3 className="font-semibold mb-2">Rezultate:</h3>
          {insuranceList.map((ins, idx) => (
            <div key={idx} className="mb-2">
              <p><strong>ID poliță:</strong> {ins.id}</p>
              <p><strong>Companie:</strong> {ins.company}</p>
              <p><strong>De la:</strong> {ins.validFrom}</p>
              <p><strong>Până la:</strong> {ins.validTo}</p>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InsuranceSearchPage;