import React, { useState } from 'react';

function AddPlateWithoutImagePage() {
  const [form, setForm] = useState({
    plateNumber: '',
    brand: '',
    model: '',
    owner: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!form.plateNumber) {
      setError('Numărul plăcuței este obligatoriu.');
      return;
    }

    try {
      const checkRes = await fetch(`http://localhost:8080/api/license-plates/${form.plateNumber}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      const existing = await checkRes.json();

      if (Array.isArray(existing) && existing.length > 0) {
        setError('O plăcuță cu acest număr există deja în sistem.');
        return;
      }

      const res = await fetch('http://localhost:8080/api/license-plates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Eroare la salvare');
      }

      setMessage('✅ Plăcuța a fost adăugată cu succes!');
      setForm({ plateNumber: '', brand: '', model: '', owner: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">🆕 Adaugă Plăcuță fără Poză</h2>
      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">Număr plăcuță:</label>
        <input
          name="plateNumber"
          value={form.plateNumber}
          onChange={handleChange}
          className="input input-bordered w-full mb-3"
          placeholder="Ex: SV15WDC"
        />

        <label className="block font-medium mb-1">Marca:</label>
        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="input input-bordered w-full mb-3"
        />

        <label className="block font-medium mb-1">Model:</label>
        <input
          name="model"
          value={form.model}
          onChange={handleChange}
          className="input input-bordered w-full mb-3"
        />

        <label className="block font-medium mb-1">Proprietar:</label>
        <input
          name="owner"
          value={form.owner}
          onChange={handleChange}
          className="input input-bordered w-full mb-4"
        />

        <button type="submit" className="primary-btn w-full">Salvează plăcuța</button>
      </form>

      {error && <div className="alert alert-error mt-4">{error}</div>}
      {message && <div className="alert alert-success mt-4">{message}</div>}
    </div>
  );
}

export default AddPlateWithoutImagePage;
