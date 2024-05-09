// hooks
import { useState } from 'react'
// css
import './Attendance.css';

function Attendance() {


	const [activeDropdown, setActiveDropdown] = useState('');

	const toggleDropdown = (dropdown) => {
		setActiveDropdown(activeDropdown === dropdown ? '' : dropdown);
	};

	return (
		<div className='attendance'>
			<div className="header">
				<div className="a-count">
					<p>Davomat:   30 dan  28</p>
				</div>
				<div className="items">
					<div className="type">
						<span onClick={() => toggleDropdown('type')}>Muassasa turi <i className={`fa-solid ${activeDropdown === 'children' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
						<div className="dropdown">
							<p>1-maktab</p>
							<p>1-bog'cha</p>
						</div>
					</div>
					<div className="group-number">
						<span>Muassasa turi <i className={`fa-solid ${activeDropdown === 'children' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
						<div className="dropdown">
							<p>1-guruh</p>
							<p>2-guruh</p>
							<p>3-guruh</p>
							<p>4-guruh</p>
						</div>
					</div>
					<div className="select-date">
						<span>Sanani tanlang <i className={`fa-solid ${activeDropdown === 'children' ? 'fa-chevron-down' : 'fa-chevron-left'}`}></i></span>
						<div className="dropdown">
							<input type="date" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Attendance