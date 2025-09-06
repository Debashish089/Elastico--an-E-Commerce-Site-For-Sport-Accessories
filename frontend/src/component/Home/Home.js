import React, { Fragment, useEffect} from "react";
import { CgMouse } from "react-icons/all";
import "./Home.css";
import ProductCard from "./ProductCard.js";

import MetaData from "../layout/MetaData.js";  
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";




const Home = () => {

  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {

    if (error) {

      alert.error(error);       // error hole react alert use kore alert dibe
      dispatch(clearErrors());  // then error clear kore dibo
    }

    dispatch(getProduct());   // backend er getProduct dispatch kroe dilam

  }, [dispatch, error, alert]);  

  return (
    <Fragment>
      {loading ? (
        <Loader />    // jodi loading hoy page tkhn layout/loader er msg dekhabe
      ) : (
        <Fragment>
          <MetaData title="ELASTICO" />

          <div className="banner">
            <p>Welcome to ELASTICO</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;