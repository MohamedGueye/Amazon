import Header from "../components/Header";
import Image from "next/image";
import { selectItems, selectTotal } from "../slices/basketSlice";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/client";
{/** Import for Stripe Session */}
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

{/** process.env.stripe_public_key is added in next.config */}
const stripePromise = loadStripe(process.env.stripe_public_key);

function checkout() {
    const items = useSelector(selectItems);
    const total = useSelector(selectTotal);
    const [session] = useSession();
    const createCheckoutSession = async () => {
        {/** Pull in stripe variable */}
        const stripe = await stripePromise;

        // Call our backend to create a checkout session 
        // Post is when you push data with your request
        const checkoutSession = await axios.post('/api/create-checkout-session', 
        {
            items: items,
            email: session.user.email
        });

        // checkoutSession should recieve session.id which is the response from stripe
        // Redirect user to Stripe Checkout Page
        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession.data.id,
        });

        if(result.error){
            alert(result.error.message);
        }
    };

    return (
        <div className="bg-gray-100">
            <Header />

            <main className="lg:flex max-w-screen-2xl mx-auto">
                {/**Left Section */}
                <div className="flex-grow m-5 shadow-sm">
                    <Image 
                    src="https://links.papareact.com/ikj"
                    width={1020}
                    height={250}
                    objectFit="contain"
                    />

                    <div className="flex flex-col p-5 space-y-10 bg-white">
                        <h1 className="text-3xl border-b pb-4">{items.length === 0 ? 'Your Basket is Empty' : 'Shopping Basket'}</h1>

                        {/**Map Through items in basket. Item has the all information about the products such as id, title, etc.. */}
                        {items.map((item, i) => (
                            <CheckoutProduct 
                                key={i}     
                                id={item.id}
                                title={item.title}
                                rating={item.rating}
                                price={item.price}
                                description={item.description}
                                category={item.category}
                                image={item.image}
                                hasPrime={item.hasPrime}

                            />
                        ))}
                    </div>
                </div>




                {/**Right Section */}
                <div className="flex flex-col bg-white p-10 shadow-md">
                    {items.length > 0 && (
                        <>
                            <h2 className="whitespace-nowrap">Subtotal ({items.length} items): 
                            <span className="font-bold ml-2"> 
                               <Currency quantity={total} currency="USD"/> 
                            </span>
                            </h2>

                            {/** When the user clicks proceed to checkout, we send the basket information to stripe and stripe will create a session where the user will be redirected to */}
                            <button onClick={createCheckoutSession} role="link" disabled={!session} className={`button mt-2 ${!session && 'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'}`}>
                                {!session ? "Sign in to checkout" : "Proceed to checkout"}
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}

export default checkout
