import React, { useState, useEffect } from 'react';
import { Search, UserMinus } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface Patient {
  mrn: string;
  name: string;
  admission_date: string;
  specialty: string;
}

const PatientDischarge: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('mrn, name, admission_date, specialty')
        .eq('discharged', false);

      if (error) throw error;

      setPatients(data || []);
    } catch (error) {
      setError('Failed to fetch patients');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDischarge = async (mrn: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .update({ discharged: true, discharge_date: new Date().toISOString() })
        .eq('mrn', mrn);

      if (error) throw error;

      setPatients(patients.filter(patient => patient.mrn !== mrn));
      alert(`Patient ${mrn} has been successfully discharged.`);
    } catch (error) {
      setError('Failed to discharge patient');
      console.error('Error:', error);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Discharge</h1>
      
      <div className="mb-4">
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search patients by name or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <li key={patient.mrn}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">{patient.name} (MRN: {patient.mrn})</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <button
                      onClick={() => handleDischarge(patient.mrn)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <UserMinus className="h-4 w-4 mr-1" />
                      Discharge
                    </button>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Admitted: {new Date(patient.admission_date).toLocaleDateString()}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      {patient.specialty}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PatientDischarge;