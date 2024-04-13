require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPEKEY)
app.use(cors());
console.log(typeof(process.env.STRIPEKEY))


app.post('/create-checkout-session',async(req,res)=>{
    const {products} = req.body;

    const lineItems = products.map((product)=>({
        price_data:{
            currency:'inr',
            product_data:{
                name:product.productName,
                images:[product.productImg]
            },
            unit_amount:product.price*100, 
        },
        quantity:1
    }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:lineItems,
        mode:'payment',
        success_url:'http://localhost:5173/paymentSuccess',
        cancel_url:'http://localhost:5173/paymentFailure'
    })

    res.json({id:session.id})
})

const port = process.env.PORT
app.listen(port,()=>{
    console.log('server running')
})