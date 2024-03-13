import { useState } from 'react'
import moment from 'moment/moment.js';
import 'moment/locale/vi';
import './Clock.scss'

const Clock = (props) => {
	const { fontSize } = props
    moment.locale('vi')
	const momentFormat = 'llll:ss'
	let time = moment().format(momentFormat)
	const [currentTime, setCurrentTime] = useState(time)

	setInterval(() => {
		let time = moment().format(momentFormat)
		setCurrentTime(time)
	}, 1000)

    return (
        <div className='header-main' style={{fontSize: `${fontSize || 16}px`}}>
			{currentTime}
        </div>
    )
}

export default Clock