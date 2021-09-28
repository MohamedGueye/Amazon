import Head from 'next/head';
import Header from '../components/Header';
import Image from "next/image";
import Banner from '../components/Banner';
import ProductFeed from '../components/ProductFeed';


export default function Home({ products }) {
  return (
    <div className="bg-gray-100">
      <Head>
        <title>Amazon 2.0</title>
      </Head>

      {/* Header */}
      <Header />

      <main className="max-w-screen-2xl max-auto">
        {/**Banner */}
        <Banner />

        {/**Product Feed */}
        <ProductFeed products={products}/>
      </main>
    </div>
  )
}

{/**Server Side Rendering */}
export async function getServerSideProps(context) {
  // Fetch products from API
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );

  // Create a props variable that will be used to pass the information from the server to the browser
  return{
    props: {
      products,
    },
  };
}


// Make a GET Request to >>> https://fakestoreapi.com/products