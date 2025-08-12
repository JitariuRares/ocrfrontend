// src/PlateSearchPage.jsx
import React, { useState } from 'react';

function PlateSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem('role') || '';

  const handleSearch = async () => {
    const q = (query || '').trim();
    if (!q) {
      setError('Introdu o plăcuță validă (ex: SV15WDC)');
      setResults([]);
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(
        `http://localhost:8080/plates/history/search?query=${encodeURIComponent(q)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || `Eroare la căutare (status ${response.status})`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults(Array.isArray(data.content) ? data.content : []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Eroare neașteptată');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (plateNumber) => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(
        `http://localhost:8080/api/license-plates/pdf/${encodeURIComponent(plateNumber)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Eroare la descărcarea PDF-ului');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `plate_${plateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Eroare PDF:', err.message);
      alert('Nu s-a putut descărca PDF-ul');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Căutare după plăcuță</h2>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ex: SV15WDC sau fragment: SV"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full max-w-xs border border-gray-300 rounded pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button onClick={handleSearch} disabled={loading} className="primary-btn">
          {loading ? 'Se caută…' : 'Caută'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && results.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plăcuță</th>
                <th>Marca</th>
                <th>Model</th>
                <th>Proprietar</th>
                <th>Imagine</th>
                <th>Data procesării</th>
                {role === 'POLICE' && <th>PDF</th>}
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.plateNumber}</td>
                  <td>{item.brand ?? '-'}</td>
                  <td>{item.model ?? '-'}</td>
                  <td>{item.owner ?? '-'}</td>
                  <td>{item.imagePath ?? '-'}</td>
                  <td>
                    {item.processedAt
                      ? new Date(item.processedAt).toLocaleString()
                      : '-'}
                  </td>
                  {role === 'POLICE' && (
                    <td>
                      <button
                        onClick={() => handleDownloadPdf(item.plateNumber)}
                        className="text-blue-600 hover:underline"
                      >
                        Descarcă PDF
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && results.length === 0 && query.trim() !== '' && (
        <div className="text-gray-600">Nu s-au găsit rezultate.</div>
      )}
    </div>
  );
}

export default PlateSearchPage;
