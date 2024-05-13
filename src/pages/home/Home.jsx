import React from 'react'

// css
import './Home.css'
import { Link } from 'react-router-dom'

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
							<img src="./public/images/children.png" alt="attendance icon" />
							<span>Davomat</span>
						</Link>
						<Link to='/payment' className="second-element">
							<img src="./public/images/salary.png" alt="salary icon" />
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
							<img src="./public/images/attendance.png" alt="attendance icon" />
							<span>Davomat</span>
						</Link>
						<Link to='/salary' className="second-element">
							<img src="./public/images/salary2.png" alt="salary icon" />
							<span>Maosh</span>
						</Link>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Harajat</h2>
					</div>
					<div className="card-body">
						<div className="first-element">
							<img src="./public/images/expends.png" alt="expends icon" />
							<span>Harajat</span>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Daromad</h2>
					</div>
					<div className="card-body">
						<div className="first-element">
							<img src="./public/images/income.png" alt="income icon" />
							<span>Daromad</span>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Hisobotlar</h2>
					</div>
					<div className="card-body">
						<div className="first-element">
							<img src="./public/images/report.png" alt="report icon" />
							<span>Hisobotlar</span>
						</div>
					</div>
				</div>
				<div className="card">
					<div className="card-header">
						<h2>Statistika</h2>
					</div>
					<div className="card-body">
						<div className="first-element">
							<img src="./public/images/statistics.png" alt="statistics icon" />
							<span>Statistika</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home