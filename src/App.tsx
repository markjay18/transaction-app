import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transaction, setTransaction] = useState("");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [charge, setCharge] = useState<number>(0);
  const [remarks, setRemarks] = useState("");

  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();

    return now.toLocaleString("en-PH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  });

  useEffect(() => {
    const value = Number(amount);

    if (value >= 2001) {
      setCharge(35);
    } else if (value >= 1401) {
      setCharge(30);
    } else if (value >= 1001) {
      setCharge(20);
    } else if (value >= 901) {
      setCharge(15);
    } else if (value >= 401) {
      setCharge(10);
    } else if (value >= 1) {
      setCharge(5);
    } else {
      setCharge(0);
    }
  }, [amount]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setDateTime(
        now.toLocaleString("en-PH", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };

    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_GOOGLE_SHEET_API_URL;

    if (!apiUrl) {
      alert("Google Sheet API URL is not configured.");
      return;
    }

    const data = {
      dateTime,
      transaction,
      amount,
      referenceNumber,
      charge,
      remarks,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to save transaction.");
      }

      alert("Transaction saved successfully!");

      setTransaction("");
      setAmount("");
      setReferenceNumber("");
      setRemarks("");
    } catch (error) {
      console.error(error);

      alert("Failed to save transaction.");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Transaction</h1>
        <p className="subtitle">Record a new transaction</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" value={dateTime} readOnly hidden />
          </div>

          <div className="form-group">
            <select
              value={transaction}
              onChange={(e) => setTransaction(e.target.value)}
              required
            >
              <option value="">Select transaction</option>
              <option value="CO">CO</option>
              <option value="CI">CI</option>
              <option value="LOAD">LOAD</option>
              <option value="MARELCO">MARELCO</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Ref. No.</label>
            <input
              type="text"
              placeholder="#1234"
              value={referenceNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                setReferenceNumber(digits ? `#${digits}` : "");
              }}
              maxLength={5}
              required
            />
          </div>

          <div className="form-group">
            <label>Charge</label>
            <input
              type="number"
              className="charge"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charge}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              placeholder="Optional remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>

          <button type="submit">Save Transaction</button>
        </form>
      </div>
    </div>
  );
}

export default App;
