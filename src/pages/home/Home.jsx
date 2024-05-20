import React from 'react'

// css
import './Home.css'
import { Link } from 'react-router-dom'

// import img
import attendande from '../../../public/images/attendance.png'
import children from '../../../public/images/children.png'
import expends from '../../../public/images/expends.png'
import income from '../../../public/images/income.png'
import report from '../../../public/images/report.png'
import salary from '../../../public/images/salary.png'
import salary2 from '../../../public/images/salary2.png'
import statistics from '../../../public/images/statistics.png'


function Home() {
	return (
		<div className='home'>
			<div className="cards">
				<div className="card">
					<div className="card-header">
						<h2>Bolalar</h2>
					</div>
					<div className="card-body">
						<Link to='/attendance' className="first-element">
							<img src={children} alt="attendance icon" />
							<span>Davomat</span>
						</Link>
						<Link to='/payment' className="second-element">
							<img src={salary} alt="salary icon" />
							<span>To'lov</span>
						</Link>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Hodimlar</h2>
					</div>
					<div className="card-body">
						<Link to='/employees' className="first-element">
							<img src={attendande} alt="attendance icon" />
							<span>Davomat</span>
						</Link>
						<Link to='/salary' className="second-element">
							<img src={salary2} alt="salary icon" />
							<span>Maosh</span>
						</Link>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Harajat</h2>
					</div>
					<div className="card-body">
						<Link to='/expenses' className="first-element">
							<img src={expends} alt="expends icon" />
							<span>Harajat</span>
						</Link>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Daromad</h2>
					</div>
					<div className="card-body">
						<Link to='/income' className="first-element">
							<img src={income} alt="income icon" />
							<span>Daromad</span>
						</Link>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Statistika</h2>
					</div>
					<div className="card-body">
						<Link to='/statistics' className="first-element">
							<img src={statistics} alt="statistics icon" />
							<span>Statistika</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home