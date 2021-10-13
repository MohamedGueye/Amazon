import Header from "../components/Header";
import { getSession, useSession } from "next-auth/client";
import db from "../../firebase";
import moment from "moment";
import Order from "../components/Order";

function orders({ orders }) {
    const [session] = useSession();

    return (
        <div>
            <Header />

            <main className="max-w-screen-lg mx-auto p-10">
                <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">Your Orders</h1>
            
            {!session ? (
                <h2>Please Sign In to see your orders</h2>
            ) : (
                <h2>{orders.length}</h2>
            )}
            
            <div className="mt-5 space-y-4">
                {orders?.map(({id, amount, amountShipping, items, timestamp, images}) => (
                    <Order 
                    key={id}
                    id={id}
                    amount={amount}
                    amountShipping={amountShipping}
                    items={items}
                    timestamp={timestamp}
                    images={images}
                    />
                ))}
            </div>
            </main>
        </div>
    )
}

export default orders;

// Server Side Rendering
export async function getServerSideProps(context) {
    // Access Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Get the user's logged in credentials
    const session = await getSession(context);

    if (!session) {
        return{
            props: {}
        };
    }

    // Initialize app in Firbase.js to access Database
    const stripeOrders = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy('timestamp', 'desc')
    .get();

    // Stripe Orders
    // We're mapping through the data in firebase and adding more information from stripe
    const orders = await Promise.all(
        stripeOrders.docs.map(async (order) => ({
            id: order.id,
            amount: order.data().amount,
            amountShipping: order.data().amount_shipping,
            images: order.data().images,
            // Use Unix fot timestamp
            timestamp: moment(order.data().timestamp.toDate()).unix(),

            // Fetch 
            items: (
                await stripe.checkout.sessions.listLineItems(order.id, {
                    limit: 100,
                }) 
            ).data,
        }))
    );

    return {
        props: {orders}
    }
}
