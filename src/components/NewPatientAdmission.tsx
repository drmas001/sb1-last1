import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

interface PatientData {
  mrn: string;
  name: string;
  age: number;  // تغيير النوع إلى number للتوافق مع الإدخال الرقمي
  gender: string;
  admission_date: string;
  admission_time: string;
  doctor: string;
  specialty: string;
}

const NewPatientAdmission: React.FC = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<PatientData>({
    mrn: '',
    name: '',
    age: 0,
    gender: '',
    admission_date: '',
    admission_time: '',
    doctor: '',
    specialty: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: name === 'age' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // التحقق من تعبئة جميع الحقول المطلوبة
      if (
        !patientData.mrn ||
        !patientData.name ||
        !patientData.age ||
        !patientData.gender ||
        !patientData.admission_date ||
        !patientData.admission_time ||
        !patientData.doctor ||
        !patientData.specialty
      ) {
        setError('All fields are required.');
        return;
      }

      // إضافة بيانات المريض إلى Supabase
      const { data, error } = await supabase
        .from('patients')
        .insert([{
          mrn: patientData.mrn,
          patient_name: patientData.name,
          age: patientData.age,
          gender: patientData.gender,
          admission_date: patientData.admission_date,
          admission_time: patientData.admission_time,
          assigned_doctor: patientData.doctor,
          specialty: patientData.specialty,
        }])
        .select();

      if (error) throw error;

      if (data) {
        navigate(`/patient/${data[0].mrn}`);
      }
    } catch (error) {
      setError('Failed to admit patient. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">New Patient Admission</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="mrn" className="block text-sm font-medium text-gray-700">
                  MRN (Medical Record Number)
                </label>
                <input
                  type="text"
                  name="mrn"
                  id="mrn"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={patientData.mrn}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={patientData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={patientData.age}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={patientData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700">
                  Admission Date
                </label>
                <input
                  type="date"
                  name="admission_date"
                  id="admission_date"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={patientData.admission_date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="admission_time" className="block text-sm font-medium text-gray-700">
                  Admission Time
                </label>
                <input
                  type="time"
                  name="admission_time"
                  id="admission_time"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={patientData.admission_time}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                  Assigned Doctor
                </label>
                <input
                  type="text"
                  name="doctor"
                  id="doctor"
                  required
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={patientData.doctor}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Medical Specialty
                </label>
                <select
                  name="specialty"
                  id="specialty"
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={patientData.specialty}
                  onChange={handleInputChange}
                >
                  <option value="">Select specialty</option>
                  <option value="General Internal Medicine">General Internal Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Cardiology">Cardiology</option>
                </select>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Admit Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPatientAdmission;
