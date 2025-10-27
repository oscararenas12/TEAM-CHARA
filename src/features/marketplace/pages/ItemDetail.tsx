import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./styles.css";
import leftImg from "../../../assets/left.png";
import rightImg from "../../../assets/right.png";
import backImg from "../../../assets/back.png";
import messageImg from "../../../assets/message.png";

interface Item {
  id: number;
  name: string;
  price: string;
  description: string;
  images: string[];
  postedBy: string;
  condition: string;
}

const ItemDetail: React.FC = () => {
  const location = useLocation();
  const item: Item | undefined = location.state?.item;

    const [user] = useState({
      name: "Alice Johnson",
      email: "alice@example.com",
      rating: "1.5",
      item_sold: "3",
      item_listed: "2"
     
    });
  

  // For image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!item) return <p>Item not found!</p>;

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === item.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    );
  };

    const handleQuickQuestion = () => {
    alert(`Message sent to ${item.postedBy}!`);
  };

  return (
     <div className="item-detail">
      <div className="item-detail-head">
      <Link to="/home" className="back-button">
        <img id="backbut" src={backImg} alt="gohome" />
      </Link> </div>

      {/* Image Carousel */}
      <div className="box item-images-box">
        <button onClick={prevImage}><img src={leftImg} alt="goleft" /></button>
        <img
          src={item.images[currentImageIndex]}
          alt={`${item.name} ${currentImageIndex + 1}`}
        />
        <button onClick={nextImage}><img  src={rightImg} alt="goright" /></button>
      </div>

      {/* Item Info */}
      <div className="item-info-box">
        <p>{item.name}</p>
        <p className="item-price">{item.price}</p>
      </div>

      <div className="box condition">
        <h3>Condition:</h3>
        <p id="condition">{item.condition}</p>

      </div>

      <div className="box description"> 
        <h3>Description</h3>
        <p className="item-description">{item.description}</p>
          
        
         </div>
      

      

      {/* Seller Info */}
      <div className="box seller-info-box">
        <h3>Seller Information</h3>
        <div className="seller-info-box1">
          <div className="seller-info-box3">
          <div className="seller-avatar">
  {user.name.charAt(0).toUpperCase()}
</div>
        <div className="seller-info-box2">
          <p>{user.name}</p>
        <p className="rating">★ {user.rating}</p></div></div>
        <Link to={`/publicprofile/${user.name}`} className="seller-link">
          <button>View Profile</button>
        </Link></div>
       
      </div>

      {/* Quick Questions */}
      <div className="box quick-questions-box">
        <h3>Quick Questions</h3>
        <div className="questions">

        <div className="question">
          
            <p>  <img  src={messageImg} alt="gohome" />Is this available?</p>

        </div>
        <div className="question">

            <p>  <img  src={messageImg} alt="gohome" />Can I pick up tomorrow?</p>

        </div>
        <div className="question">
          
            <p>  <img  src={messageImg} alt="gohome" /> What's the condition like?</p>

        </div>

         <div className="question">
           
            <p>  <img  src={messageImg} alt="gohome" /> Can you send more photos?</p>

        </div>
        </div>
      
      </div>
    </div>
  );
};

export default ItemDetail;