import React from 'react';
import { Carousel } from 'antd';
const contentStyle = {
    margin: 0,
    height: '100%',
    width: '100%',
    margin: '20px auto',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};
function Banner() {
    return (
        <div style={{ width: '90%', height: '570px', margin: 'auto', borderRadius: '40px' }} className='max-[1200px]:hidden rounded-3xl'>
            <Carousel autoplay>
                <div>
                    <img style={contentStyle} className='rounded-3xl' src='https://vietpro.edu.vn/wp-content/uploads/2019/12/php-3-thang-2.png' />
                </div>
                <div>
                    <img style={contentStyle} className='rounded-3xl' src='https://iviettech.vn/wp-content/uploads/2023/01/Banner-Khoa-hoc-lap-trinh-Python-2.jpg' />
                </div>
            </Carousel>

        </div>
    )
};
export default Banner;