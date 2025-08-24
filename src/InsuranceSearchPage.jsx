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
    <>
      <div className="search-form">
        <h2>📄 Caută Asigurare după Număr Plăcuță</h2>

        <input
          type="text"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          className="search-input"
          placeholder="Ex: SV15WDC"
        />

        <button onClick={handleSearch} className="search-btn">Caută</button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {insuranceList.length > 0 && (
        <div className="card bg-green-50 mt-4">
          <h3 className="font-semibold mb-2">Rezultate:</h3>
          {insuranceList.map((ins, idx) => (
            <div key={idx} className="mb-4">
              <p><strong>ID poliță:</strong> {ins.id}</p>
              <p><strong>Companie:</strong> {ins.company}</p>
              <p><strong>De la:</strong> {ins.validFrom}</p>
              <p><strong>Până la:</strong> {ins.validTo}</p>
              <hr className="my-2" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default InsuranceSearchPage;
