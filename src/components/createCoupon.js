import React, { useState } from 'react';

function CreateCoupon(props) {
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState({});
    const [toast, setToast] = useState({});
    const [couponCode, setCouponCode] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [type, setType] = useState('Flat');
    const [discountAmount, setDiscountAmount] = useState(''); //If Type == percentag discountAmount = dicountPercentage
    const [minimumPurchaseAmount, setMinimumPurchaseAmount] = useState('');
    const [maximumDiscountAmount, setMaximumDiscountAmount] = useState('');

    const handleSubmit = event => {
        event.preventDefault();
        setLoading(true);
        // console.log(formError);
        // console.log(Object.keys(formError).every(key => formError[key].length < 1));
        if (Object.keys(formError).every(key => formError[key].length < 1)) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let body = JSON.stringify({
                "couponCode": couponCode,
                "amount": discountAmount,
                "startDate": startDate.toISOString(),
                "endDate": new Date(endDate.getTime()+((24*60*60*1000)-1)).toISOString(), //to cover full day
                "MinimumPurchaseAmount": minimumPurchaseAmount ? minimumPurchaseAmount : 0,
                "MaximumDiscountAmount": maximumDiscountAmount ? maximumDiscountAmount : 0,
                "type": type
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: body,
                redirect: 'follow'
            };

            fetch(`${props.uri}/api/coupon`, requestOptions)
                .then((res) => res.json())
                .then((json) => {
                    console.log(json);
                    let toast = json.message.split(':');
                    setToast({ type: toast[0], message: toast[1] });
                    setLoading(false);

                    //clear all the state values -> should have used a single state
                    setCouponCode('');
                    setEndDate('');
                    setStartDate('');
                    setDiscountAmount('');
                    setMaximumDiscountAmount(''); //if set to 0 placeholder will not get displayed.
                    setMinimumPurchaseAmount('');
                }).catch((err)=>{console.log(err)});
        } else {
            setLoading(false);
        }

    }

    const handleCouponCode = event => {
        if (event.target.value.length > 9) {
            setFormError({ ...formError, "couponCode": "Coupon code can be of max 8 characters." })
        } else if (event.target.value.length < 3) {
            setFormError({ ...formError, "couponCode": "Coupon code should be more than 3 characters." });
            setCouponCode(event.target.value.toUpperCase());
        } else {
            setFormError({ ...formError, "couponCode": '' })
            setCouponCode(event.target.value.toUpperCase());
        }
    }

    const handleDate = (event, dateType) => {
        if (dateType === 'startDate') {
            let date = new Date(event.target.value);
            if (formError.endDate && date < endDate) {
                setFormError({ ...formError, "endDate": '' });
            } else {
                setFormError({ ...formError, "endDate": 'End date should be after start date' });
            }
            setStartDate(date);
        } else {
            let date = new Date(event.target.value);
            if (!startDate || startDate > date) {
                setFormError({ ...formError, "endDate": 'End date should be after start date' });
                setEndDate(new Date(event.target.value));
            } else {
                setFormError({ ...formError, "endDate": '' });
                setEndDate(date);
            }
        }
    }

    const handleDiscount = event => {
        let discount = event.target.value ? parseInt(event.target.value) : 0;
        if (type === 'Percentage' && discount > 100) {
            setFormError({ ...formError, "discountAmount": 'Percentage cannot be more than 100%' });
        } else {
            setFormError({ ...formError, "discountAmount": '' });
            setDiscountAmount(discount);
        }
    }

    //return
    if (loading) {
        return (
            <div className='loader'></div>
        )
    } else {
        return (
            <form onSubmit={handleSubmit}>
                {toast.type === 'Failure' ? <div className='failure-toast'>{toast.message}</div> : toast.type === 'Success' ? <div className='success-toast'>{toast.message}</div> : ''}
                {toast.type ? <div style={{ display: 'none' }}>{setTimeout(() => { setToast({}) }, 5000)}</div> : ''}
                <div className="title">CREATE NEW COUPON</div>
                <div className='field'>
                    <div className='label'>Enter new coupon code</div>
                    <input className='coupon-input' type='text' name='couponCode' placeholder='RNCH500' value={couponCode} onChange={handleCouponCode} required />
                    {formError.couponCode ? <div className='error-label'>{formError.couponCode}</div> : ''}
                </div>
                <div className='field'>
                    <div className='label'>Start Date</div>
                    <input className='coupon-input' type='date' name='startDate' placeholder={new Date().toISOString().split('T')[0]} value={startDate && startDate.toISOString().split('T')[0]} onChange={(e) => { handleDate(e, 'startDate') }} required />
                </div>
                <div className='field'>
                    <div className='label'>End Date</div>
                    <input className='coupon-input' type='date' name='endDate' placeholder='500' value={endDate && endDate.toISOString().split('T')[0]} onChange={(e) => { handleDate(e, 'endDate') }} required />
                    {formError.endDate ? <div className='error-label'>{formError.endDate}</div> : ''}
                </div>
                <div className='field'>
                    <div className='label'>Type</div>
                    <select name="Type" value={type} onChange={(e) => { setType(e.target.value) }}>
                        <option value="Flat">Flat</option>
                        <option value="Percentage">Percentage</option>
                    </select>
                </div>
                <div className='field'>
                    <div className='label'>Discount {type !== 'Percentage' ? 'Amount' : 'Percentage'}</div>
                    <input className='coupon-input' type='number' name='amount' placeholder='500' value={discountAmount} onChange={handleDiscount} required />
                    {formError.discountAmount ? <div className='error-label'>{formError.discountAmount}</div> : ''}
                </div>
                <div className='field'>
                    <div className='label'>Minimum Purchase Amount</div>
                    <input className='coupon-input' type='number' name='minimumPurchaseAmount' placeholder='500' value={minimumPurchaseAmount} onChange={e => { setMinimumPurchaseAmount(parseInt(e.target.value)) }} />
                </div>
                {
                    type !== 'Percentage' ? '' :
                        <div className='field'>

                            <div className='label'>Maximum Discount Amount</div>
                            <input className='coupon-input' type='number' name='MaximumDiscountAmount' placeholder='500' value={maximumDiscountAmount} onChange={e => { setMaximumDiscountAmount(parseInt(e.target.value)) }} />
                        </div>
                }

                <div className='field'>
                    <input type="submit" className='coupon-create-btn' value='create' />
                    {Object.keys(formError).every(key => formError[key].length < 1) ? '' : <div className='error-label' style={{ textAlign: 'center' }}>There are errors on the form.</div>}
                </div>
            </form>
        );
    }

}
export default CreateCoupon;