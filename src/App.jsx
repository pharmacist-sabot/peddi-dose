// src/App.jsx

import React, { useState } from 'react';
import './App.css'; // นำเข้าไฟล์ CSS ของเรา

function App() {
  // สร้าง "state" หรือ "กล่องเก็บข้อมูล" สำหรับ
  // 1. น้ำหนักที่ผู้ใช้กรอก
  // 2. ผลลัพธ์การคำนวณ
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  // ฟังก์ชันที่จะทำงานเมื่อผู้ใช้กดปุ่ม "คำนวณ"
  const handleCalculate = (event) => {
    event.preventDefault(); // ป้องกันหน้าเว็บรีเฟรชตัวเอง

    // แปลงข้อความน้ำหนักเป็นตัวเลข
    const weightNum = parseFloat(weight);

    // ตรวจสอบว่าผู้ใช้กรอกตัวเลขที่ถูกต้องหรือไม่
    if (isNaN(weightNum) || weightNum <= 0) {
      alert('กรุณาป้อนน้ำหนักเป็นตัวเลขที่มากกว่า 0');
      return; // หยุดทำงานถ้าข้อมูลไม่ถูกต้อง
    }

    // --- ส่วนของสูตรคำนวณ ---
    // ตัวอย่าง: ยาพาราเซตามอลสำหรับเด็ก (ความเข้มข้น 120 mg / 5 ml)
    const dosePerKg = 15;      // mg ต่อน้ำหนัก 1 kg (ใช้ค่าสูงสุดเพื่อความปลอดภัย)
    const concentration = 120; // ความเข้มข้นของยา (mg)
    const volume = 5;          // ปริมาตรของยา (ml)

    // 1. คำนวณปริมาณยาที่ต้องการทั้งหมด (หน่วยเป็น mg)
    const totalMgDose = weightNum * dosePerKg;

    // 2. คำนวณว่าจะต้องให้ยากี่ ml จากปริมาณ mg ที่คำนวณได้
    const finalMlDose = (totalMgDose * volume) / concentration;

    // อัปเดต "กล่องเก็บข้อมูล" ของผลลัพธ์
    // .toFixed(2) คือการแสดงผลทศนิยม 2 ตำแหน่ง
    setResult(finalMlDose.toFixed(2));
  };

  // ส่วนนี้คือโค้ดที่แสดงผลหน้าเว็บ (HTML ภายใน JavaScript ที่เรียกว่า JSX)
  return (
    <div className="App">
      <div className="calculator-card">
        <h1>คำนวณขนาดยาน้ำเด็ก</h1>
        <p className="subtitle">(ตัวอย่าง: Paracetamol 120mg/5ml)</p>

        <form onSubmit={handleCalculate}>
          <label htmlFor="weight">น้ำหนักเด็ก (kg)</label>
          <input
            type="number"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)} // ทุกครั้งที่พิมพ์ จะอัปเดตค่าน้ำหนัก
            placeholder="ป้อนน้ำหนักเป็นกิโลกรัม"
            required
            step="any" // อนุญาตให้ใส่ทศนิยมได้
          />
          <button type="submit">คำนวณ</button>
        </form>

        {/* ส่วนนี้จะแสดงก็ต่อเมื่อมีผลลัพธ์ (result ไม่ใช่ null) */}
        {result && (
          <div className="result-box">
            <h2>ขนาดยาที่ต้องให้:</h2>
            <p className="result-text">{result} มิลลิลิตร (ml)</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;