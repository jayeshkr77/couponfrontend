import React, { useEffect, useState } from 'react';


function List(props) {
    const [list, setList] = useState([]);
    useEffect(() => {
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${props.uri}/api/coupon`, requestOptions)
            .then((res) => res.clone().json())
            .then((json) => {setList(json.data)})
            .catch(error => console.log('error', error));
    }, []);
    if (!list.length) {
        return (
            <div className='loader'></div>
        )
    } else {
        return (
            <>
            <div className="title">COUPONS</div>
            <ul className='list-coupon'>
                {list.map((coupon,index)=> <li key={index}> {coupon.couponCode} <div className='right'><div>Valid Till: {coupon.endDate.split('T')[0]}</div></div></li>)}
            </ul>
            </>
        )
            
    }
}

export default List;