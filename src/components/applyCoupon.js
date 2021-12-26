import React, { useEffect, useState } from 'react';


function ApplyCoupon(props) {
    const [couponCode, setCouponCode] = useState('');
    const [cart, setCart] = useState(props.cart);
    const [toast, setToast] = useState({});
    const [res, setRes] = useState({});

    useEffect(() => {
        if (props.cart !== cart) {
          setCart(props.cart);
          setToast({});
          setRes({});
        }
    }, [props.cart]);
    const applyCouponCode = event => {
        event.preventDefault();

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var body = JSON.stringify({
            "cart": props.cart,
            "couponCode": couponCode
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: body,
            redirect: 'follow'
        };

        fetch(`${props.uri}/api/coupon/apply`, requestOptions)
            .then(response => response.json())
            .then(result => {
                let toast = result.message.split(':');
                setToast({ type: toast[0], message: toast[1] });
                setRes(result.data);
            })
            .catch(error => { console.log('error', error) });
    }
    return (
        <>
            <div className="title">CHECKOUT</div>
            <form onSubmit={applyCouponCode}>
                <div className='field'>
                    <div className='label'>Enter your coupon code</div>
                    <input className='coupon-input' type='text' name='couponCode' placeholder='RNCH500' value={couponCode} onChange={(e) => { setCouponCode(e.target.value) }} required />
                </div>
                <div className='field'>
                    <input type="submit" className='coupon-create-btn' value='Apply' />
                </div>
                <div>
                    <div className='reciet'>
                        {toast.type === 'Failure' ? <div className='failure-toast'>{toast.message}</div> : toast.type === 'Success' ? <div className='success-toast'>{toast.message}</div> : ''}

                        {
                            toast.type === 'Success' ? <div>
                            <div>Item Total <span className='right'>₹{props.cart}</span></div>
                            <div>Code {couponCode} applied <span className='right'>-₹{res.discount}</span> </div>
                            <div>Grand Total <span className='right'>₹{props.cart - res.discount}</span></div>
                        </div> : ''
                        }
                    </div>

                </div>
                <button className='coupon-create-btn'>Proceed to pay {res.discount ? '₹' : ''}{res.discount ? props.cart - res.discount : props.cart}</button>
            </form>
        </>
    )

    // }
}

export default ApplyCoupon;