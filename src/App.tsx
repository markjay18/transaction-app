import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transaction, setTransaction] = useState("");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [charge, setCharge] = useState<string>("0");
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    // Kapag lumampas sa 10000, manual input na ang charge
    if (value > 10000) {
      setCharge("0");
      return;
    }

    if (value >= 9500) {
      setCharge("145");
    } else if (value >= 9000) {
      setCharge("135");
    } else if (value >= 8500) {
      setCharge("130");
    } else if (value >= 8000) {
      setCharge("120");
    } else if (value >= 7500) {
      setCharge("115");
    } else if (value >= 7000) {
      setCharge("105");
    } else if (value >= 6500) {
      setCharge("100");
    } else if (value >= 6000) {
      setCharge("90");
    } else if (value >= 5500) {
      setCharge("85");
    } else if (value >= 5000) {
      setCharge("75");
    } else if (value >= 4500) {
      setCharge("70");
    } else if (value >= 4000) {
      setCharge("60");
    } else if (value >= 3500) {
      setCharge("55");
    } else if (value >= 3000) {
      setCharge("45");
    } else if (value >= 2500) {
      setCharge("40");
    } else if (value >= 2000) {
      setCharge("30");
    } else if (value >= 1500) {
      setCharge("25");
    } else if (value >= 1001) {
      setCharge("20");
    } else if (value >= 900) {
      setCharge("15");
    } else if (value >= 400) {
      setCharge("10");
    } else if (value >= 1) {
      setCharge("5");
    } else {
      setCharge("0");
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
      setIsLoading(true);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      // Basahin muna ang raw response
      const responseText = await response.text();

      console.log("HTTP Status:", response.status);
      console.log("API Response:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // I-parse ang JSON response
      let result;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid JSON response from API.");
      }

      if (result.success !== true) {
        throw new Error(result.message || "Failed to save transaction.");
      }

      alert("Transaction saved successfully!");

      setTransaction("");
      setAmount("");
      setReferenceNumber("");
      setRemarks("");
    } catch (error) {
      console.error("Transaction error:", error);

      alert("Failed to save transaction.");
    } finally {
      setIsLoading(false);
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
              <option value="PLDT">PLDT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="10000"
              placeholder="0"
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
              placeholder="0"
              value={charge}
              onChange={(e) => setCharge(e.target.value)}
              readOnly={
                transaction !== "LOAD" &&
                transaction !== "MARELCO" &&
                transaction !== "PLDT" &&
                Number(amount) <= 10000
              }
              required
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

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Save Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
