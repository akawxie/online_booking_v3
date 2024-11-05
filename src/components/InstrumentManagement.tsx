import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { Instrument } from '../types';
import { useInstruments } from '../hooks/useInstruments';
import { DeleteInstrumentModal } from './DeleteInstrumentModal';

interface EditableInstrument extends Omit<Instrument, 'id'> {
  id?: string;
}

const defaultImageUrl = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400';

const statusStyles = {
  'Available': 'bg-green-100 text-green-800',
  'Maintenance': 'bg-yellow-100 text-yellow-800',
  'Out of Service': 'bg-red-100 text-red-800'
} as const;

export function InstrumentManagement() {
  const { instruments, addInstrument, updateInstrument, deleteInstrument } = useInstruments();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instrumentToDelete, setInstrumentToDelete] = useState<Instrument | null>(null);
  const [newInstrument, setNewInstrument] = useState<EditableInstrument>({
    name: '',
    type: '',
    location: '',
    imageUrl: '',
    status: 'Available'
  });

  const handleAdd = () => {
    setIsAdding(true);
    setError(null);
    setNewInstrument({
      name: '',
      type: '',
      location: '',
      imageUrl: '',
      status: 'Available'
    });
  };

  const validateInstrument = (instrument: EditableInstrument, existingId?: string) => {
    if (!instrument.name.trim()) return 'Instrument name is required';
    if (!instrument.type.trim()) return 'Type is required';
    if (!instrument.location.trim()) return 'Location is required';
    
    const nameExists = instruments.some(
      i => i.name.toLowerCase() === instrument.name.toLowerCase() && i.id !== existingId
    );
    if (nameExists) return 'An instrument with this name already exists';
    
    if (instrument.imageUrl) {
      const urlPattern = /^https:\/\/images\.unsplash\.com\/.+/;
      if (!urlPattern.test(instrument.imageUrl)) {
        return 'If provided, image URL must be from Unsplash';
      }
    }

    return null;
  };

  const handleSave = async (instrument: EditableInstrument, isNew: boolean = false) => {
    const validationError = validateInstrument(instrument, isNew ? undefined : editingId);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // If no image URL is provided, use the default
      const finalInstrument = {
        ...instrument,
        imageUrl: instrument.imageUrl || defaultImageUrl
      };

      if (isNew) {
        await addInstrument(finalInstrument);
        setIsAdding(false);
      } else if (editingId) {
        await updateInstrument({ ...finalInstrument, id: editingId });
        setEditingId(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to save instrument');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (instrument: Instrument) => {
    setEditingId(instrument.id);
    setError(null);
  };

  const handleDeleteClick = (instrument: Instrument) => {
    setInstrumentToDelete(instrument);
  };

  const handleConfirmDelete = async () => {
    if (instrumentToDelete) {
      try {
        await deleteInstrument(instrumentToDelete.id);
        setInstrumentToDelete(null);
      } catch (err) {
        setError('Failed to delete instrument');
      }
    }
  };

  const renderRow = (instrument: Instrument | EditableInstrument, isEditing: boolean) => {
    if (isEditing) {
      return (
        <tr key={instrument.id || 'new'} className="border-b">
          <td className="p-2">
            <input
              type="text"
              value={instrument.name}
              onChange={(e) => isAdding 
                ? setNewInstrument({ ...newInstrument, name: e.target.value })
                : updateInstrument({ ...instrument, name: e.target.value })}
              className="w-full p-1 border rounded"
              placeholder="Name"
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              value={instrument.type}
              onChange={(e) => isAdding
                ? setNewInstrument({ ...newInstrument, type: e.target.value })
                : updateInstrument({ ...instrument, type: e.target.value })}
              className="w-full p-1 border rounded"
              placeholder="Type"
            />
          </td>
          <td className="p-2">
            <select
              value={instrument.status}
              onChange={(e) => isAdding
                ? setNewInstrument({ ...newInstrument, status: e.target.value as Instrument['status'] })
                : updateInstrument({ ...instrument, status: e.target.value as Instrument['status'] })}
              className="w-full p-1 border rounded"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </td>
          <td className="p-2">
            <input
              type="text"
              value={instrument.location}
              onChange={(e) => isAdding
                ? setNewInstrument({ ...newInstrument, location: e.target.value })
                : updateInstrument({ ...instrument, location: e.target.value })}
              className="w-full p-1 border rounded"
              placeholder="Location"
            />
          </td>
          <td className="p-2">
            <input
              type="text"
              value={instrument.imageUrl}
              onChange={(e) => isAdding
                ? setNewInstrument({ ...newInstrument, imageUrl: e.target.value })
                : updateInstrument({ ...instrument, imageUrl: e.target.value })}
              className="w-full p-1 border rounded"
              placeholder="Unsplash Image URL (optional)"
            />
          </td>
          <td className="p-2">
            <div className="flex gap-2">
              <button
                onClick={() => isAdding ? handleSave(newInstrument, true) : handleSave(instrument)}
                className="p-1 text-green-600 hover:text-green-800"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr key={instrument.id} className="border-b hover:bg-gray-50">
        <td className="p-2">{instrument.name}</td>
        <td className="p-2">{instrument.type}</td>
        <td className="p-2">
          <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[instrument.status]}`}>
            {instrument.status}
          </span>
        </td>
        <td className="p-2">{instrument.location}</td>
        <td className="p-2">
          {instrument.imageUrl ? (
            <img
              src={instrument.imageUrl}
              alt={instrument.name}
              className="w-12 h-12 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </td>
        <td className="p-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(instrument as Instrument)}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Pencil className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteClick(instrument as Instrument)}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Instrument Management</h2>
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            Add Instrument
          </button>
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAdding && renderRow(newInstrument, true)}
            {instruments.map(instrument => renderRow(
              instrument,
              editingId === instrument.id
            ))}
          </tbody>
        </table>
      </div>

      {instrumentToDelete && (
        <DeleteInstrumentModal
          instrumentName={instrumentToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setInstrumentToDelete(null)}
        />
      )}
    </div>
  );
}