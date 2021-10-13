import { buffer } from 'micro';
import * as admin from 'firebase-admin';

// Give admin permission to access database
const serviceAccount = require('../../../permission.json'); 

// Initialize App
// This means if the app is not already initialized then initialize it
const app = !admin.apps.length ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
}) : admin.app();


// Connect with Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endPointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
    // Create Firestore Database and attach it
    return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders").doc(session.id).set({
        // We want to push the readable amount in the database
        amount: session.amount_total / 100,
        amount_shipping: session.total_details.amount_shipping / 100,
        images: JSON.parse(session.metadata.images),
        timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log(`Success: Order ${session.id} had been added to the Database`)
    })

}

export default async (req, res) => {
    if (req.method === "POST") {
        // Load up event recieved from stripe
        const requestBuffer = await buffer(req);
        const payload = requestBuffer.toString();
        const sig = req.headers["stripe-signature"];

        let event;

        // Verify that the event came from Stripe
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endPointSecret);
        } catch(err) {
            console.log('ERROR', err.message)
            return res.status(400).send(`Webhook error: ${err.message}`)
        } 

        // Handle the checkout.session.completed event if it passed the check
        if(event.type === 'checkout.session.completed') {
            const session = event.data.object; 

            // Store event in database
            return fulfillOrder(session)
            .then(() => res.status(200))
            .catch(err => res.status(400).send(`Webhook Error ${err.message}`))
        }

    }
};

// Resolved by Stripe
export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
}