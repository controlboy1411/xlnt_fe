import { useEffect, useState } from 'react'
import './OneColumnChart.scss'

const OneColumnChart = (props) => {
    const { currentValue, maxValue, title, progressColor } = props
    const [percent, setPercent] = useState(0)

    useEffect(() => {
        if (currentValue >= 0 && currentValue <= maxValue) {
            setPercent(Number(currentValue * 100/ maxValue).toFixed(2))
        }
    }, [currentValue, maxValue])

    return (
        <div className='one-column-chart'>
            <div className='progress-bar-title'>{maxValue}</div>
                <div className="progress progress-bar-vertical">
                    <div className='progress-current-value' style={{
                        color: 'black',
                        display: percent < 10 ? 'contents' : 'none'
                    }}>{currentValue}</div>
                    <div className="progress-bar" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" style={{height: `${percent}%`, backgroundColor: `${progressColor || '#0d6efd'}`}}>
                        <span className='progress-current-value' style={{
                            color: 'white',
                            display: percent < 10 ? 'none' : 'contents'
                        }}>{currentValue}</span>
                    </div>
                </div>
            <div className='progress-bar-title'>{title}</div>
        </div>
    )
}

export default OneColumnChart