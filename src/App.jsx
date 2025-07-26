// src/App.jsx

import React, { useState } from 'react';
import { drugList } from './drugData';
import './App.css';

function App() {
  // --- State Management ---
  const [weight, setWeight] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState(drugList[0].id);
  const [result, setResult] = useState(null);

  // --- Functions ---

  // 1. สร้างฟังก์ชันปัดเศษเป็น .0 หรือ .5 (เพิ่มเข้ามาตรงนี้)
  const roundToHalf = (num) => {
    return Math.round(num * 2) / 2;
  };

  // 2. ฟังก์ชันคำนวณที่เรียกใช้ roundToHalf
  const calculateDose = (weight, drug) => {
    const minTotalMg = weight * drug.minDosePerKg;
    const maxTotalMg = weight * drug.maxDosePerKg;

    const minMl = (minTotalMg * drug.volume) / drug.concentration;
    const maxMl = (maxTotalMg * drug.volume) / drug.concentration;

    // เรียกใช้ฟังก์ชันที่สร้างไว้ด้านบน
    const roundedMinMl = roundToHalf(minMl);
    const roundedMaxMl = roundToHalf(maxMl);

    // ส่งคืนค่าที่ปัดเศษและจัดรูปแบบแล้ว
    return {
      min: roundedMinMl.toFixed(1),
      max: roundedMaxMl.toFixed(1),
      notes: drug.notes,
    };
  };

  // 3. ฟังก์ชันที่จะทำงานเมื่อกดปุ่ม "คำนวณ"
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

    const calculationResult = calculateDose(weightNum, selectedDrug);
    setResult(calculationResult);
  };

  // --- JSX (UI) ---
  return (
    <div className="App">
      <div className="calculator-card">
        <h1>คำนวณขนาดยาน้ำเด็ก</h1>

        <form onSubmit={handleCalculate}>
          <label htmlFor="drug-select">เลือกยาที่ต้องการคำนวณ</label>
          <select
            id="drug-select"
            value={selectedDrugId}
            onChange={(e) => {
              setSelectedDrugId(e.target.value);
              setResult(null);
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

          <button type="submit">คำนวณ</button>
        </form>

        {result && (
          <div className="result-box">
            <h2>ขนาดยาที่แนะนำต่อครั้ง:</h2>
            <p className="result-text">
              {result.min === result.max 
                ? `${result.min} ml`
                : `${result.min} - ${result.max} ml`
              }
            </p>
            <p className="notes-text"><strong>คำแนะนำ:</strong> {result.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;