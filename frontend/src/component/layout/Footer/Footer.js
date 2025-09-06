import React from "react";
import playStore from "../../../images/playstore.jpg";
import appStore from "../../../images/Appstore.jpg";
import "./Footer.css";   // Footer er css


const Footer = () => {
  return (
    
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <h1>ELASTICO.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2025 </p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.youtube.com/@debashishdas712">Instagram</a>
        <a href="https://www.youtube.com/@debashishdas712">Youtube</a>
        <a href="https://www.youtube.com/@debashishdas712">Facebook</a>
      </div>
    </footer>




  );  
};

export default Footer;