'use client';

import React, { useState } from 'react';
import { User, Plus, X, Save, AlertTriangle, Loader2 } from 'lucide-react';
import { Patient } from '@/lib/types';
import { createPatient } from '@/lib/api';
import { PatientRowSkeleton } from '@/components/ui/SkeletonBlock';

interface PatientInfoTableProps {
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (patientId: string) => void;
  onAddPatient?: (newPatient: Patient) => void;
  /** When true, renders skeleton rows instead of real data. */
  isLoading?: boolean;
}

export default function PatientInfoTable({
  patients,
  activePatientId,
  onSelectPatient,
  onAddPatient,
  isLoading = false,
}: PatientInfoTableProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: 45,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    referringDoctor: 'Dr. Arjun Patel',
    historyNotes: '',
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);
    try {
      const created = await createPatient({
        name: formData.name || 'New Patient',
        age: Number(formData.age),
        gender: formData.gender,
        referringDoctor: formData.referringDoctor,
        historyNotes: formData.historyNotes,
      });
      if (onAddPatient) onAddPatient(created);
      setFormData({
        name: '',
        age: 45,
        gender: 'Male',
        referringDoctor: 'Dr. Arjun Patel',
        historyNotes: '',
      });
      setShowAddModal(false);
    } catch (err: any) {
      // Inline styled error — no alert()
      setModalError(err.message || 'Failed to save patient record. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setModalError(null);
  };

  return (
    <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          Patient Information
        </h3>
        <button
          onClick={() => { setModalError(null); setShowAddModal(true); }}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 font-semibold text-xs transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Patient Record
        </button>
      </div>

      {/* Patient Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-3 font-semibold">Patient ID</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Age / Gender</th>
              <th className="p-3 font-semibold">Scan Date</th>
              <th className="p-3 font-semibold">Ref. Doctor</th>
              <th className="p-3 font-semibold">History / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <PatientRowSkeleton key={i} />)
              : patients.map((p) => {
                  const isSelected = p.id === activePatientId;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectPatient(p.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-500/10 font-medium text-white'
                          : 'hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="p-3 font-mono text-cyan-400 font-semibold">{p.patientCode}</td>
                      <td className="p-3 font-semibold text-white">{p.name}</td>
                      <td className="p-3">{p.age} / {p.gender}</td>
                      <td className="p-3 text-slate-400">{p.lastScanDate}</td>
                      <td className="p-3 text-slate-300">{p.referringDoctor}</td>
                      <td className="p-3 text-slate-400 max-w-xs truncate">{p.historyNotes}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-cyan-500/30 p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Add Synthetic Patient Record
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inline error banner — replaces alert() */}
            {modalError && (
              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Referring Doctor</label>
                <input
                  type="text"
                  value={formData.referringDoctor}
                  onChange={(e) => setFormData({ ...formData, referringDoctor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Symptoms / Medical History Notes</label>
                <textarea
                  rows={3}
                  value={formData.historyNotes}
                  onChange={(e) => setFormData({ ...formData, historyNotes: e.target.value })}
                  placeholder="Fever, cough, chest tightness..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Record
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
