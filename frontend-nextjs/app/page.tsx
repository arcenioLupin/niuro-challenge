"use client";
import { useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:5272/auth/login/next", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // importante para la cookie
      body: JSON.stringify({ phone, otp }),
    });
    if (!res.ok) { alert("Invalid OTP"); return; }
    alert("Logged in!");
  };

  const resume = () => {
    window.location.href = "http://localhost:4200/"; // Angular User App
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Next Hub</h1>
      <div style={{ display:"grid", gap:12, maxWidth:360 }}>
        <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input placeholder="OTP (use 123456)" value={otp} onChange={e=>setOtp(e.target.value)} />
        <button onClick={login}>Login</button>
        <button onClick={resume}>Resume Application → Angular1</button>
      </div>
    </main>
  );
}
