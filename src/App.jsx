// src/App.jsx

import React, { useState } from 'react';
import { drugList } from './drugData';
import './App.css';

function App() {
  // --- State Management ---
  const [weight, setWeight] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState(drugList[0].id);
  const [result, setResult] = useState(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualDose, setManualDose] = useState('');

  // --- Functions ---

  const roundToHalf = (num) => {
    return Math.round(num * 2) / 2;
  };

  const calculateDose = (weight, drug) => {
    const minTotalMg = weight * drug.minDosePerKg;
    const maxTotalMg = weight * drug.maxDosePerKg;

    const minMl = (minTotalMg * drug.volume) / drug.concentration;
    const maxMl = (maxTotalMg * drug.volume) / drug.concentration;

    const roundedMinMl = roundToHalf(minMl);
    const roundedMaxMl = roundToHalf(maxMl);

    return {
      min: roundedMinMl.toFixed(1),
      max: roundedMaxMl.toFixed(1),
      notes: drug.notes,
    };
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const weightNum = parseFloat(weight);

    if (isNaN(weightNum) || weightNum <= 0) {
      alert('กรุณาป้อนน้ำหนักเป็นตัวเลขที่ถูกต้อง');
      setResult(null);
      return;
    }

    const selectedDrug = drugList.find(drug => drug.id === parseInt(selectedDrugId));
    if (!selectedDrug) return;

    let calculationResult;

    if (isManualMode) {
      const dosePerKg = parseFloat(manualDose);
      if (isNaN(dosePerKg) || dosePerKg <= 0) {
        alert('กรุณาป้อนขนาดยา (mg/kg/dose) เป็นตัวเลขที่ถูกต้อง');
        setResult(null);
        return;
      }
      
      const totalMg = weightNum * dosePerKg;
      const finalMl = (totalMg * selectedDrug.volume) / selectedDrug.concentration;
      
      calculationResult = {
        mode: 'Manual',
        drugName: selectedDrug.name.split(' (')[0],
        weight: weightNum,
        specifiedDose: dosePerKg,
        finalMl: roundToHalf(finalMl).toFixed(1),
        notes: selectedDrug.notes,
      };

    } else {
      const autoResult = calculateDose(weightNum, selectedDrug);
      calculationResult = {
        mode: 'Auto',
        ...autoResult
      };
    }

    setResult(calculationResult);
  };

  // --- JSX (UI) ---
  return (
    <div className="App">
      <div className="calculator-card">
        <h1>Pedi-Dose Calc</h1>
        <h2>คำนวณขนาดยาน้ำเด็ก</h2>

        <form onSubmit={handleCalculate}>
          <label htmlFor="drug-select">เลือกยาที่ต้องการคำนวณ</label>
          <select
            id="drug-select"
            value={selectedDrugId}
            onChange={(e) => {
              setSelectedDrugId(e.target.value);
              setResult(null);
              setManualDose(''); // ล้างค่า manual dose เมื่อเปลี่ยนยา
            }}
          >
            {drugList.map(drug => (
              <option key={drug.id} value={drug.id}>
                {drug.name}
              </option>
            ))}
          </select>

          <label htmlFor="weight">น้ำหนักเด็ก (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="ป้อนน้ำหนักเป็นกิโลกรัม"
            required
            step="any"
          />

          <div className="manual-dose-toggle">
            <input
              type="checkbox"
              id="manual-mode-check"
              checked={isManualMode}
              onChange={(e) => {
                setIsManualMode(e.target.checked);
                setResult(null);
              }}
            />
            <label htmlFor="manual-mode-check">ระบุขนาดยาเอง (Manual Dose)</label>
          </div>

          {isManualMode && (
            <div className="manual-dose-input">
              <label htmlFor="manual-dose">ขนาดยาที่ต้องการ (mg/kg/dose):</label>
              <input
                type="number"
                id="manual-dose"
                value={manualDose}
                onChange={(e) => setManualDose(e.target.value)}
                placeholder={`แนะนำ: ${
                  drugList.find(d => d.id === parseInt(selectedDrugId))?.minDosePerKg
                } - ${
                  drugList.find(d => d.id === parseInt(selectedDrugId))?.maxDosePerKg
                }`}
                required={isManualMode} // บังคับกรอกเฉพาะเมื่ออยู่ในโหมดนี้
                step="any"
              />
            </div>
          )}

          <button type="submit">คำนวณ</button>
        </form>

        {result && (
          <div className="result-box">
            {result.mode === 'Auto' && (
              <>
                <h2>ขนาดยาที่แนะนำต่อครั้ง:</h2>
                <p className="result-text">
                  {result.min === result.max
                    ? `${result.min} ml`
                    : `${result.min} - ${result.max} ml`}
                </p>
              </>
            )}

            {result.mode === 'Manual' && (
              <>
                <h2>ผลการคำนวณ (แบบระบุเอง)</h2>
                <div className="result-summary">
                  <span>ยา: <strong>{result.drugName}</strong></span>
                  <span>น้ำหนัก: <strong>{result.weight} กก.</strong></span>
                  <span>ขนาดยาที่ระบุ: <strong>{result.specifiedDose} mg/kg/dose</strong></span>
                </div>
                <hr/>
                <p className="manual-result-label">ปริมาณยาที่ต้องใช้ต่อครั้งคือ:</p>
                <p className="result-text manual-result-text">{result.finalMl} ml</p>
              </>
            )}

            <p className="notes-text"><strong>คำแนะนำ:</strong> {result.notes}</p>
          </div>
        )}
        <footer className="card-footer">
          <hr />
          <p>กลุ่มงานเภสัชกรรมฯ โรงพยาบาลสระโบสถ์</p>
          <div className="footer-contact">
            <span>📧 pharmacistsabot@gmail.com</span>
            <span>📞 036-776240 ต่อ 104</span>
          </div>
          <p className="copyright">© {new Date().getFullYear()} สงวนลิขสิทธิ์</p>
        </footer>
      </div>
    </div>
  );
}

export default App;