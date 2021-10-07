import Image from "next/image";
import {
    MenuIcon,
    SearchIcon,
    ShoppingCartIcon,
} from "@heroicons/react/outline";
import {signIn, signOut, useSession} from "next-auth/client";
// Routing
import { useRouter } from "next/router";
import { selectItems } from "../slices/basketSlice";
import { useSelector } from "react-redux";

function Header() {
    const [session] = useSession();

    {/** When the user clicks on the back or forward button the browser will show the page in the stack */}
    const router = useRouter();

    // Pull items from the Global Store
    const items = useSelector(selectItems);

    return (
        <header>
            {/** Top Nav */}
            <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
                {/**sm:flex-grow-0 When small screen is passed image container doesn't flex anymore */}
                <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
                    {/** We need to whitelist where we're pulling the image from on next.config.js */}
                    {/** When the user clicks on the amazon image it will take them to Home Page */}
                    <Image 
                    onClick={() => router.push("/")}
                    src="https://links.papareact.com/f90"
                    alt=""
                    width={150}
                    height={40}
                    objectFit="contain"
                    className="cursor-pointer"
                    />
                </div>

                {/** Search Bar */}
                {/**hidden sm:flex When small screen is passed this div will display */}
                <div className="hidden sm:flex items-center h-10 rounded-md flex-grow bg-yellow-400 hover:bg-yellow-500 cursor-pointer">
                    <input className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4" type="text" />
                    <SearchIcon className="h-12 p-4" />
                </div>

                {/**Right Section */}
                <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                    {session ? (
                <div>
                    <p>Hello, {session.user.name}</p>
                    <p className="font-extrabold md:text-sm">Account & Lists</p>
                    <p onClick={signOut} className="link">Sign Out</p>
                </div>
                    ) : (
                        <div onClick={signIn} className="link">
                        <p>Hello, Sign In</p>
                        <p className="font-extrabold md:text-sm">Account & Lists</p>
                    </div>
                    )}

                    <div className="link">
                        <p>Returns</p>
                        <p className="font-extrabold md:text-sm">& Orders</p>
                    </div>

                    <div onClick={() => router.push("/checkout")} className="relative link flex items-center">

                        <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">{items.length}</span>

                        <ShoppingCartIcon className="h-10" />
                        <p className="font-extrabold md:text-sm hidden md:inline mt-2">Basket</p>
                    </div>
                </div>
            </div>

            {/** Bottom Nav */}
            <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm">
                <p className="flex link items-center">
                    <MenuIcon className="h-6 mr-1"/>
                    All
                </p>

                <p className="link">Prime Video</p>
                <p className="link">Amazon Business</p>
                <p className="link">Today's Deals</p>
                <p className="link hidden lg:inline-flex">Electronics</p>
                <p className="link hidden lg:inline-flex">Food & Grocery</p>
                <p className="link hidden lg:inline-flex">Prime</p>
                <p className="link hidden lg:inline-flex">Buy Again</p>
                <p className="link hidden lg:inline-flex">Shopper Toolkit</p>
                <p className="link hidden lg:inline-flex">Health & Personal Care</p>
            </div>
        </header>
    )
}

export default Header
