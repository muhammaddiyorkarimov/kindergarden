import React, { act, useState } from 'react'
import './ExpensesCreate.css'
import ExpensesType from '../../components/ExpensesType'

function ExpensesCreate() {

  const [data, setData] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [groupId, setgroupId] = useState(1);

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

  return (
    <div className='attendance'>
      <p>Harajat qo'shish</p>
      <div>
        <ExpensesType activeDropdown={activeDropdown} toggleDropdown={toggleDropdown}/>
      </div>
    </div>
  )
}

export default ExpensesCreate