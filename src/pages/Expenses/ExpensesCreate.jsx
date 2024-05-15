import React, { useEffect, useState } from "react";

// css
import "./ExpensesCreate.css";
//axios
import axios from "../../service/Api";
import { Alert, AlertTitle } from "@mui/material";

function ExpensesCreate({ handleGetGroupId, expenseId }) {
  const [data, setData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [type, setType] = useState(1);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [alert, setAlert] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/accounting/expenses/list/`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I",
          },
        });

        setExpenses(response.data.results);
        console.log(19, response.data.results);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [expenseId]);

  function Validation() {
    return type && amount.length<=14 && comment;
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
      const PostData = {
        type: type,
        amount: parseFloat(amount),
        comment: comment,
      };
      const response = await axios.post(
        `/accounting/expenses/create/`,
        PostData,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I",
          },
        }
      );
      setData(response.data);
      console.log("Post successful:", response.data);
      setComment("");
      setAmount("");
      setAlert(false)
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (id) => {
    toggleDropdown("");
    console.log(id);
    setType(id);
  };
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };

  const uniqueExpenses = Array.from(
    new Set(expenses.map((expense) => expense.type.name))
  ).map((name) => {
    return expenses.find((expense) => expense.type.name === name);
  });

  // const handleClose = () => {
  //   setShowAlert(false);
  // };

  return (
    <div className="attendance expenses-create">
      {showAlert && (
        <Alert
          sx={{
            position: "absolute",
            width: "500px",
          }}
          variant="filled"
          severity={alert?'error':'success'}
        >
          <AlertTitle>{alert?'error':'success'}</AlertTitle>
          {alert ? "Iltimos to'ldiring" : "Muvaffaqiyatli saqlandi!"}
        </Alert>
      )}
      <div className="expenses-title">
        <p>Harajat qo'shish</p>
      </div>
      <div className="expenses-inputs">
        <div
          className={`select-expenses group-number ${
            activeDropdown === "group-number" ? `active` : ""
          }`}
        >
          <span onClick={() => toggleDropdown("group-number")}>
            Harajat turi{" "}
            <i
              className={`fa-solid ${
                activeDropdown === "group-number"
                  ? "fa-chevron-down"
                  : "fa-chevron-left"
              }`}
            ></i>
          </span>
          <div
            style={{
              display: activeDropdown === "group-number" ? "block" : "none",
            }}
            className={`dropdown drop-down`}
          >
            <ul>
              {uniqueExpenses.map((expense) => {
                console.log(uniqueExpenses);
                return (
                  <li
                    key={expense.id}
                    onClick={() => handleClick(expense.type.id)}
                  >
                    {expense.type.name}
                  </li>
                );
              })}
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
    </div>
  );
}

export default ExpensesCreate;
