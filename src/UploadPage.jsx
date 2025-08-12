import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editData, setEditData] = useState({ brand: '', model: '', owner: '' });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleCropConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewUrl, croppedAreaPixels]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setCarData(null);
    setSuccessMessage('');
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowCropper(true);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!previewUrl || !croppedAreaPixels) return;

    try {
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);
      const croppedPreviewUrl = URL.createObjectURL(croppedBlob);
      setPreviewUrl(croppedPreviewUrl);
      setSelectedFile(croppedBlob);
      setShowCropper(false);
    } catch (err) {
      setError('Eroare la crop!');
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) {
      setError('Nu ai selectat o imagine.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedFile, 'cropped.png');

      const response = await fetch('http://localhost:8080/api/ocr/full', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => null);
        throw new Error(msg || `Eroare (status ${response.status})`);
      }

      const data = await response.json();
      setCarData(data);
      setEditData({ brand: data.brand || '', model: data.model || '', owner: data.owner || '' });
      setError('');
      setSuccessMessage('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDetails = async () => {
    if (!carData || !carData.id) {
      setError('Nu există o plăcuță validă pentru actualizare.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/license-plates/${carData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const msg = await response.text().catch(() => null);
        throw new Error(msg || `Eroare la actualizare (status ${response.status})`);
      }

      const updated = await response.json();
      setCarData(updated);
      setSuccessMessage('Detaliile au fost actualizate cu succes!');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Plăcuță Auto</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />

      {showCropper && previewUrl && (
        <div className="relative w-full h-80 bg-gray-100 mt-4">
          <Cropper
            image={previewUrl}
            crop={crop}
            zoom={zoom}
            aspect={4 / 1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
          <p className="text-sm text-center text-gray-600 mt-2">Apasă ENTER pentru a confirma selecția</p>
        </div>
      )}

      {!showCropper && previewUrl && (
        <img src={previewUrl} alt="Preview crop-uit" className="mt-4 max-w-full h-auto rounded-md shadow-md" />
      )}

      {!showCropper && previewUrl && (
        <button onClick={handleUpload} className="primary-btn mt-4">Trimite imaginea</button>
      )}

      {carData && (
        <div className="alert alert-success mt-4">
          <p><strong>Plăcuță:</strong> {carData.plateNumber}</p>
          <p><strong>Utilizator:</strong> {carData.user} {carData.role ? `(${carData.role})` : ''}</p>

          <hr className="my-2" />

          <label className="block font-medium">Marca:</label>
          <input type="text" name="brand" value={editData.brand} onChange={handleEditChange} className="input input-bordered w-full mt-1 mb-2" />

          <label className="block font-medium">Model:</label>
          <input type="text" name="model" value={editData.model} onChange={handleEditChange} className="input input-bordered w-full mt-1 mb-2" />

          <label className="block font-medium">Proprietar:</label>
          <input type="text" name="owner" value={editData.owner} onChange={handleEditChange} className="input input-bordered w-full mt-1 mb-2" />

          <button onClick={handleSaveDetails} className="primary-btn mt-2">Salvează detaliile</button>
        </div>
      )}

      {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
      {error && <div className="alert alert-error mt-4"><strong>Eroare:</strong> {error}</div>}
    </div>
  );
}

export default UploadPage;
