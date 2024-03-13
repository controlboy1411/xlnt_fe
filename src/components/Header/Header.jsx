import { Clock } from '../../shared';
import logoImg from '../../assets/logo.png';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Header.scss';
import { ROUTER } from '../../utils/configs/router.config';

const Header = () => {
    const [responsiveType, setResponsiveType] = useState(window.innerWidth < 600 ? 2 : 1)
    const navigate = useNavigate()

    window.addEventListener('resize', () => {
        if (window.innerWidth < 600) {
            setResponsiveType(2)
        } else {
            setResponsiveType(1)
        }
    })

    return (
        <div className='mb-3'>
        {responsiveType === 1 ?
            <div className='row justify-content-center align-items-center'>
                <div className='col-sm-3 d-flex align-items-center'>
                    <img src={logoImg} alt="logo" className='header-logo' onClick={() => {navigate(ROUTER.HOME)}}/>
                </div>
                <div className='col-sm-6 d-flex justify-content-center align-items-center'>
                    <div className='header-title-name-1'>THÔNG TIN GIÁM SÁT TRẠM XỬ LÝ NƯỚC THẢI</div>
                </div>
                <div className='col-sm-3 d-flex justify-content-end'>
                    <Clock fontSize={16}/>
                </div>
            </div> :
            <div>
                <div className='row row-cols-2 justify-content-center align-items-center'>
                    <div className='col-6 d-flex align-items-center'>
                        <img src={logoImg} alt="logo" width="70px" height="70px"/>
                    </div>
                    <div className='col-6 d-flex justify-content-end'>
                        <Clock fontSize={14}/>
                    </div>
                </div>
                <div className='header-title-name-2'>THÔNG TIN GIÁM SÁT TRẠM XỬ LÝ NƯỚC THẢI</div>
            </div>
        }
        </div>
    )
}

export default Header