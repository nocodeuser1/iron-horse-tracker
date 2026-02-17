const XLSX = require('xlsx');
const fs = require('fs');
const crypto = require('crypto');

const wb = XLSX.readFile('Example Data.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const raw = XLSX.utils.sheet_to_json(ws);

// Skip header row
const data = raw.slice(1).filter(r => r.__EMPTY && r.__EMPTY_2 && r.__EMPTY_2.trim());

const equipmentTypes = ['Compressor', 'Storage Tank', 'Flare', 'Dehydrator', 'Heater', 'Thermal Oxidizer', 'Amine Unit', 'Engine', 'Generator'];

function excelDateToISO(serial) {
  if (!serial || typeof serial !== 'number') return null;
  const d = new Date((serial - 25569) * 86400000);
  return d.toISOString().split('T')[0];
}

function sanitize(text) {
  if (!text) return '';
  return text
    .replace(/Delek/gi, 'Iron Horse Midstream')
    .replace(/\r\n/g, '\n')
    .trim();
}

function guessEquipment(action, req) {
  const combined = (action + ' ' + req).toLowerCase();
  if (combined.includes('amine')) return 'Amine Unit';
  if (combined.includes('flare') || combined.includes('fl-')) return 'Flare';
  if (combined.includes('thermal oxidizer') || combined.includes('to-1')) return 'Thermal Oxidizer';
  if (combined.includes('eng-') || combined.includes('engine')) return 'Engine';
  if (combined.includes('comp')) return 'Compressor';
  if (combined.includes('htr-') || combined.includes('heater') || combined.includes('boiler')) return 'Heater';
  if (combined.includes('tank') || combined.includes('tk-')) return 'Storage Tank';
  if (combined.includes('gen-')) return 'Generator';
  if (combined.includes('dehydrat')) return 'Dehydrator';
  return 'General';
}

// Generate realistic dates around 2025-2026
function generateDates(recurrence, index) {
  const baseDate = new Date('2025-01-15');
  const now = new Date('2026-02-17');
  const offsets = {
    'Per Event': [30, 60, 90, 120, 180, 240, 300, 360],
    'Initial': [0, 30],
    'Continual': [0],
    'Monthly': [30, 60, 90, 120, 150, 180],
    'Quarterly': [90, 180, 270, 360],
    'Semi-Annual': [180, 360],
    'Annual': [365],
    'Initial / Biannual (Every 2 Years)': [730],
    'Initial / Quarterly': [0, 90, 180, 270],
    'Initial / Annual': [0, 365],
  };
  
  const key = Object.keys(offsets).find(k => recurrence.includes(k)) || 'Annual';
  const offset = offsets[key][index % offsets[key].length];
  const neededBy = new Date(baseDate);
  neededBy.setDate(neededBy.getDate() + offset + (index * 17) % 60);
  
  const isPast = neededBy < now;
  const isCompleted = isPast ? Math.random() > 0.15 : Math.random() > 0.7;
  
  let completedDate = null;
  if (isCompleted) {
    const comp = new Date(neededBy);
    comp.setDate(comp.getDate() - Math.floor(Math.random() * 14));
    completedDate = comp.toISOString().split('T')[0];
  }
  
  return {
    neededBy: neededBy.toISOString().split('T')[0],
    completedDate,
  };
}

const requirements = data.map((row, i) => {
  const recurrence = sanitize(row.__EMPTY_1 || '').replace(/\n/g, ' ').replace(/\s+/g, ' ');
  const action = sanitize(row.__EMPTY_2 || '');
  const reqCovered = sanitize(row.__EMPTY_3 || '');
  const dates = row.__EMPTY_4 ? 
    { neededBy: excelDateToISO(row.__EMPTY_4), completedDate: null } : 
    generateDates(recurrence, i);
  
  return {
    id: crypto.randomUUID(),
    typeOfAction: sanitize(row.__EMPTY),
    recurrence,
    action,
    requirementsCovered: reqCovered,
    neededBy: dates.neededBy,
    completedDate: dates.completedDate,
    fileUploaded: sanitize(row.__EMPTY_6 || '') || null,
    equipmentType: guessEquipment(action, reqCovered),
  };
});

fs.writeFileSync('src/lib/data/sample-requirements.json', JSON.stringify(requirements, null, 2));
console.log(`Wrote ${requirements.length} requirements`);
