import React, { useState, useEffect } from 'react';
import { FormStep } from '../FormStep';
import { StepProps } from '../../types/form';

const Step3SectorsServed: React.FC<StepProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
  isValid,
}) => {
  const API_BASE = 'https://9smxz58iuh.execute-api.ap-south-1.amazonaws.com/Sectors-You-Serve';
  const initialDroneSectors = [
    'Agriculture & Precision Farming',
    'Construction & Infrastructure',
    'Mining & Quarrying',
    'Oil & Gas',
    'Power & Energy',
    'Transportation & Logistics',
    'Defense & Security',
    'Emergency Services',
    'Environmental Monitoring',
    'Real Estate & Photography',
    'Entertainment & Media',
    'Research & Education',
    'Other',
  ];

  const initialAiSectors = [
    'Healthcare & Medical',
    'Finance & Banking',
    'Retail & E-commerce',
    'Manufacturing & Industry 4.0',
    'Education & EdTech',
    'Transportation & Autonomous Systems',
    'Smart Cities & IoT',
    'Cybersecurity',
    'Legal & Compliance',
    'Entertainment & Gaming',
    'Agriculture & AgTech',
    'Energy & Utilities',
    'Other',
  ];

  const initialGisSectors = [
    'Urban Planning & Development',
    'Land Management & Surveying',
    'Environmental & Natural Resources',
    'Transportation & Infrastructure',
    'Utilities & Telecommunications',
    'Agriculture & Forestry',
    'Disaster Management',
    'Mining & Geology',
    'Defense & Border Management',
    'Maritime & Coastal',
    'Archaeology & Heritage',
    'Public Health & Epidemiology',
    'Other',
  ];

  const [droneSectors, setDroneSectors] = useState(initialDroneSectors);
  const [aiSectors, setAiSectors] = useState(initialAiSectors);
  const [gisSectors, setGisSectors] = useState(initialGisSectors);


  // Load sectors from API on mount
  useEffect(() => {
    const normalize = async (res: Response) => {
      try {
        const json = await res.json();
        if (Array.isArray(json)) return json;
        if (json && Array.isArray(json.data)) return json.data;
        return [];
      } catch (e) {
        return [];
      }
    };

    const fetchAll = async () => {
      try {
        const [droneRes, aiRes, gisRes] = await Promise.all([
          fetch(`${API_BASE}/details/Drone`, { method: 'GET' }),
          fetch(`${API_BASE}/details/AI`, { method: 'GET' }),
          fetch(`${API_BASE}/details/GIS`, { method: 'GET' }),
        ]);
        const [drone, ai, gis] = await Promise.all([
          normalize(droneRes),
          normalize(aiRes),
          normalize(gisRes),
        ]);
        if (drone.length) setDroneSectors(drone);
        if (ai.length) setAiSectors(ai);
        if (gis.length) setGisSectors(gis);
        // (removed) no localStorage persistence for category lists
      } catch (error) {
};

export default Step3SectorsServed;
