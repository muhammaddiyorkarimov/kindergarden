// hooks
import { useEffect, useState } from "react";
// react loader
import { ThreeDots } from "react-loader-spinner";

// axios API
import axios from "../../service/Api";

// css

// components
import InstitutionType from "../../components/InstitutionType";
import GroupNumber from "../../components/GroupNumber";
import { useNavigate } from "react-router-dom";
import ExpensesType from "../../components/ExpensesType";

function Expenses() {
  // useState
  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [groupId, setgroupId] = useState(1);
  const [date, setDate] = useState("2024-12-05");
  const [loading, setLoading] = useState(true);

  // useNavigate
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/accounting/expenses/list/?type=${groupId}`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE2MTAwMDAwLCJpYXQiOjE3MTU0OTUyMDAsImp0aSI6ImNkMjk1MmNkMGYxMTQ2MDI4MDI4MzY0NmZkNTliNDBhIiwidXNlcl9pZCI6Mn0.jVbUeu07YwETmBh47hYakUjS5jCCO77lEVVMkDzor5I",
          },
        });

        setData(response.data.results);
        setLoading(false);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [groupId]);
  console.log(data);

  // handle get ins id
  const handleGetGroupId = (id) => {
    console.log(id);
    setgroupId(id);
  };
  console.log(groupId);

  // toggle dropdown
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? "" : dropdown);
  };
  // handle get date
  const handleGetDate = (e) => {
    setDate(e.target.value);
  };


  function handleOpenExpense(){
    navigate(`/expenses/expensescreate`)
  }

  return (
    <div className="attendance">
      {loading ? (
        <div className="loading">
          <ThreeDots color="#222D32" />
        </div>
      ) : (
        <>
          <div className="header">
            <div onClick={handleOpenExpense} className="a-count">
              <p>Harajat qo'shish</p>
            </div>
            <div className="items">
              <ExpensesType 
              title='Harajat turi'
               handleGetGroupId={handleGetGroupId}
               activeDropdown={activeDropdown}
               toggleDropdown={toggleDropdown}
              />

              <div className="select-date">
                <input type="date" onChange={handleGetDate} />
              </div>
            </div>
          </div>
          <div className="body">
            <table>
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th>Summa</th>
                  <th>
                    <span>Sana</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  console.log(item);
                  return (
                    <tr key={item.id}>
                      <td
                        className="name-click"
                        onClick={() => handleNameAbout(item)}
                      >
                        {item.comment}
                      </td>
                      <td>{item.amount}</td>
                      <td>{item.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="loading">
                <p>Ma'lumot topilmadi</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Expenses;
