import React, { useState } from 'react';
import ApplyCoupon from './applyCoupon';
import CreateCoupon from './createCoupon';
import List from './listCoupon';

// const URI = "http://localhost:4000";
const URI = "https://couponas.herokuapp.com";

function Home(props) {

    const [cartValue, setCartValue] = useState('');
    
    return (
        <div className='home-container'>
            <div className='home-card create-coupon'>
                <CreateCoupon uri={URI}/>
            </div>
            <div className='home-card cart'>
                <div className="title">CART</div>
                <form>
                    <div className='field'>
                        <div className='label'>Enter your cart amount</div>
                        <input className='cart-input' type='number' name='cartAmount' placeholder='500' value={cartValue} onChange={(e) => { setCartValue(e.target.value) }} />
                    </div>
                </form>
            </div>
            <div className='home-card apply-coupon'>
                <ApplyCoupon cart={cartValue} uri={URI}/>
            </div>
            <div className='home-card display-coupon'>
                <List uri={URI} />
            </div>
        </div>
    )
}

export default Home;