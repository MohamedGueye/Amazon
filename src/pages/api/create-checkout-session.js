const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// What's being called when we hit the end point
export default async (req, res) => {
    // Pull out the items and email from the request
    const { items, email } = req.body;

    // Transform our data so it can be readable to stripe
    const transformedItems = items.map(item => ({
        description: item.description,
        quantity: 1,
        // price_data is what stripe expects
        price_data: {
            currency: 'usd',
            unit_amount: item.price * 100,
            product_data: {
                name: item.title,
                images: [item.image] // Image expects an array
            },
        }
    }))

    // Telling Stripe to create session
    const session = await stripe.checkout.sessions.create({
        // Payment Type
        payment_method_types: ["card"],

        // Shipping Information
        shipping_address_collection: {
            allowed_countries: ['US', 'GB', 'CA']
        },

        // Shipping Rates
        shipping_rates: ['shr_1JiukdDAoe3k00dmEJiXoFNH'],

        // Items
        line_items: transformedItems,

        // Payment mode
        mode: 'payment',

        // Success url
        success_url: `${process.env.HOST}/success`,

        // Cancel url
        cancel_url: `${process.env.HOST}/checkout`,

        // Additional Information
        metadata: {
            email,
            images: JSON.stringify(items.map(item => item.image)) 
        },
    });

    res.status(200).json({id: session.id})
};
