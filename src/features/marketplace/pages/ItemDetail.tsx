import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./styles.css";
import leftImg from "../../../assets/left.png";
import rightImg from "../../../assets/right.png";
import backImg from "../../../assets/back.png";

interface Item {
  id: number;
  name: string;
  price: string;
  description: string;
  images: string[];
  postedBy: string;
}

const ItemDetail: React.FC = () => {
  const location = useLocation();
  const item: Item | undefined = location.state?.item;
  

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

      <div className="box description"> 
        <h3>Description</h3>
        <p className="item-description">{item.description}</p> </div>

      

      {/* Seller Info */}
      <div className="box seller-info-box">
        <h3>Seller Information</h3>
        <Link to={`/profile/${item.postedBy}`} className="seller-link">
          {item.postedBy}'s Profile
        </Link>
      </div>

      {/* Quick Questions */}
      <div className="box quick-questions-box">
        <h3>Quick Questions</h3>
        <div className="questions">

        <div className="question">
            <p>Is this available?</p>

        </div>
        <div className="question">
            <p>Can I pick up tomorrow?</p>

        </div>
        <div className="question">
            <p>What's the condition like?</p>

        </div>

         <div className="question">
            <p>Can you send more photos?</p>

        </div>
        </div>
        <button onClick={handleQuickQuestion} className="quick-question-btn">
          Send a message to seller
        </button>
      </div>
    </div>
  );
};

export default ItemDetail;