import { useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Formal");
  const [recipient, setRecipient] = useState("Manager");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/generate-email", {
        purpose,
        tone,
        recipient,
      });
      setEmail(res.data.email);
    } catch (err) {
      console.error("❌ Axios Error:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    alert("📋 Email copied to clipboard!");
  };

  const handleReload = () => {
    setPurpose("");
    setTone("Formal");
    setRecipient("Manager");
    setEmail("");
  };

  return (
    <div className="App">
      <h1>QUICKDRAFT</h1>

      <textarea
        placeholder="Enter the purpose of the email..."
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />

      <div className="inline-controls">
        <select value={tone} onChange={(e) => setTone(e.target.value)}>
          <option>Formal</option>
          <option>Polite</option>
          <option>Casual</option>
        </select>

        <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
          <option>Manager</option>
          <option>HR</option>
          <option>Professor</option>
          <option>Friend</option>
        </select>
      </div>

      <div className="center-button">
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "✉️ Generate Email"}
        </button>
      </div>

      {loading && <div className="spinner"></div>}

      {email && (
        <div className="generated-email">
          <strong>Generated Email:</strong>
          <div>{email}</div>

          <div className="button-row">
            <button onClick={handleCopy}>📋 Copy Email</button>
            <button onClick={handleReload}>🔄 Reload</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
