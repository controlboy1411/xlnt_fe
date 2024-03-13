import './BoxData.scss';

const BoxData = (props) => {
    const { title, unit, value, backgroundColor, textColor } = props;

    return (
        <div className='border-box' style={{backgroundColor: `${backgroundColor || '#e9ecef'}`, color: `${textColor || 'white'}`}}>
            <div className='border-box-content'>{`${title} (${unit})`}</div>
            <div className='border-box-content'>{value}</div>
        </div>
    )
}

export default BoxData