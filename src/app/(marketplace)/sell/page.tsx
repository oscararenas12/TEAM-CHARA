"use client";

import React, { useRef, useState, useEffect } from "react";
import "../styles.css";

export default function SellPage() {
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [isbn, setIsbn] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls: string[] = Array.from(files).map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...urls].slice(0, 6)); // limit previews to 6

    // reset input so same file can be selected again if needed
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just log the payload. Integration with backend can be added later.
    console.log({ title, description, price, category, images });
    alert("Listing created (demo). Check console for payload.");

    // clear form (optional)
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setCondition("");
    setIsbn("");
    images.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCancel = () => {
    // Clear all form fields and revoke object URLs
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setCondition("");
    setIsbn("");
    images.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Clear ISBN when user switches away from Books category
  useEffect(() => {
    if (category !== "books") setIsbn("");
  }, [category]);

  return (
    <div className="sell-page">
      <div className="create-listing">
        <h2 id="page-head">Create Listing</h2>
        <p className="subtext">
          Share what you're looking to sell with the campus community
        </p>
      </div>

      {/* Photos Section */}
      <div className="photos-wrapper">
        <div className="box photos-see">
          <h3>Photos (Required)</h3>
          <div className="photos-container">
            {images.length > 0 &&
              images.map((src, i) => (
                <div className="photo-preview" key={i}>
                  <img src={src} alt={`preview-${i}`} />
                  <button
                    type="button"
                    className="remove-photo"
                    onClick={() => removeImage(i)}
                  >
                    X
                  </button>
                </div>
              ))}

            {/* Add Photo Tile */}
            <label className="add-photo-tile" htmlFor="photo-input">
              <input
                id="photo-input"
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                style={{ display: "none" }}
              />

              {/* Visible UI for adding photo*/}
              <div className="add-inner">
                <div className="plus">+</div>
                <div className="add-text">Add Photos</div>
                <div className="small-note">
                  {images.length}/6 photos selected
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="item-details">
        <h3>Item Details</h3>
        <form onSubmit={handleSubmit} className="item-form">
          {/* Title Input */}
          <label className="field">
            <span className="required">Title</span>
            <input
              type="text"
              placeholder="Short, descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          {/* Description Input */}
          <label className="field">
            <span className="required">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item, condition, and any important details"
              rows={5}
              required
            />
          </label>
          {/* Conindition Input */}
          <label className="field">
            <span className="required">Condition</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="" disabled>
                Select condition
              </option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </label>

          {/* Price and Category Inputs */}
          <div className="row">
            <label className="field small">
              <span className="required">Price</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$0.00"
                required
              />
            </label>

            <label className="field small">
              <span className="required">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* Conditionally show ISBN when category is Books */}
          {category === "books" && (
            <label className="field">
              <span className="required">ISBN (optional)</span>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="ex: 123-1-123-12345-1"
              />
            </label>
          )}

          <div className="actions">
            <div className="row">
              <button type="submit" className="primary">
                Create Listing
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
