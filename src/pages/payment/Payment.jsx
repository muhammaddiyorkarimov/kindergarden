// hooks
import { useState } from 'react';
// components
import GroupNumber from '../../components/GroupNumber'
import InstitutionType from '../../components/InstitutionType'
// css
import './Payment.css'

function Payment() {

	return (
		<div className='payment attendance'>
			<div className="header">
				<div className="a-count">
					<p>To'lov: 30 dan 5</p>
				</div>
				<div className="items">
					{/* <InstitutionType />
					<GroupNumber /> */}
					<div className="select-date">
						<input type='date' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Payment