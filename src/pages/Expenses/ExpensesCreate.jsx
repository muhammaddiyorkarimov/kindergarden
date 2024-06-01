import React, { useEffect, useState } from "react";
import "./ExpensesCreate.css";
import axios from "../../service/Api";
import { Alert, AlertTitle } from "@mui/material";
import Cookies from 'js-cookie';
import { ThreeDots } from "react-loader-spinner";

function ExpensesCreate({ handleGetGroupId, expenseId }) {
  const [data, setData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [type, setType] = useState(1);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expensesType, setExpensesType] = useState('Harajat turi');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`/accounting/expense-type/list/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenses(response.data || []);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [expenseId]);

  function Validation() {
    return type && amount.length <= 14 && comment;
  }

  const handlePostData = async () => {
    if (!Validation()) {
      setAlert(true);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return;
    }

    try {
      const token = Cookies.get('access_token');
      const postData = {
        type: type,
        amount: parseFloat(amount),
        comment: comment,
      };
      const response = await axios.post(
        `/accounting/expenses/create/`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data);
      setComment("");
      setAmount("");
      setAlert(false);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleClick = (expense) => {
    toggleDropdown("");
    setType(expense.type.id);
    setExpensesType(expense.type.name);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  const uniqueExpenses = expenses.length > 0 ? Array.from(
    new Set(expenses.map((expense) => expense.name))
  ).map((name) => {
    return expenses.find((expense) => expense.name === name);
  }) : [];

  return (
    <div className="attendance expenses-create">
      {showAlert && (
        <Alert
          sx={{
            position: "absolute",
            width: "500px",
          }}
          variant="filled"
          severity={alert ? 'error' : 'success'}
        >
          <AlertTitle>{alert ? 'error' : 'success'}</AlertTitle>
          {alert ? "Iltimos to'ldiring" : "Muvaffaqiyatli saqlandi!"}
        </Alert>
      )}
      {loading ? (
        <div className="loading">
          <ThreeDots color="#222D32" />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="expenses-title">
            <p>Harajat qo'shish</p>
          </div>
          <div className="expenses-inputs">
            <div
              className={`select-expenses group-number ${activeDropdown === "group-number" ? `active` : ""}`}
            >
              <span onClick={() => toggleDropdown("group-number")}>
                {expensesType}{" "}
                <i className={`fa-solid ${activeDropdown === "group-number" ? "fa-chevron-down" : "fa-chevron-left"}`}></i>
              </span>
              <div
                style={{
                  display: activeDropdown === "group-number" ? "block" : "none",
                }}
                className={`dropdown drop-down`}
              >
                <ul>
                  {uniqueExpenses.length === 0 ? (
                    <li>Ma'lumot topilmadi</li>
                  ) : (
                    uniqueExpenses.map((expense) => (
                      <li key={expense.id} onClick={() => handleClick(expense)}>
                        {expense.name}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            <div className="textarea">
              <textarea
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                placeholder="Izoh..."
                className="text-area"
              />
            </div>
            <div className="input-costs">
              <input
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                placeholder="Summani kiriting"
                type="text"
              />
            </div>
          </div>
          <div className="btn-class">
            <button onClick={handlePostData}>Saqlash</button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpensesCreate;
