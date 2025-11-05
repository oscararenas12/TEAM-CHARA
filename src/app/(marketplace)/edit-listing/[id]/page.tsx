'use client';

import React, { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../../styles.css";
import { useListingStore } from "@/lib/useListingsStore";

export default function EditListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = Number(searchParams.get("id"));

  const items = useListingStore(state => state.items);
  const setItems = useListingStore(state => state.setItems);

  const listing = items.find(item => item.id === listingId);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<string[]>(listing?.images || []);
  const [title, setTitle] = useState(listing?.name || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [price, setPrice] = useState(listing?.price || "");
  const [category, setCategory] = useState(listing?.category || "other");
  const [condition, setCondition] = useState(listing?.condition || "like-new");
  const [isbn, setIsbn] = useState(listing?.isbn || "");

  useEffect(() => {
    if (!listing) {
      alert("Listing not found!");
      router.push("/profile");
    }
  }, [listing, router]);

  // Clear ISBN if category is not books
  useEffect(() => {
    if (category !== "books") setIsbn("");
  }, [category]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...urls].slice(0, 6));
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    const updatedItems = items.map(item =>
      item.id === listingId
        ? {
            ...item,
            name: title,
            description,
            price,
            category,
            condition,
            images,
            isbn,
            updatedAt: new Date().toISOString(),
          }
        : item
    );

    setItems(updatedItems);
    router.push("/profile");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="sell-page">
      <div className="create-listing">
        <h2 id="page-head">Edit Listing</h2>
        <p className="subtext">Update your item details</p>
      </div>

      {/* Photos */}
      <div className="photos-wrapper">
        <div className="box photos-see">
          <h3>Photos</h3>
          <div className="photos-container">
            {images.map((src, i) => (
              <div className="photo-preview" key={i}>
                <img src={src} alt={`preview-${i}`} />
                <button type="button" className="remove-photo" onClick={() => removeImage(i)}>X</button>
              </div>
            ))}

            <label className="add-photo-tile">
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFiles}
                style={{ display: "none" }}
              />
              <div className="add-inner">
                <div className="plus">+</div>
                <div className="add-text">Add Photos</div>
                <div className="small-note">{images.length}/6 photos</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="item-details">
        <h3>Edit Details</h3>
        <form onSubmit={handleSave} className="item-form">
          <label className="field">
            <span className="required">Title</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label className="field">
            <span className="required">Description</span>
            <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>

          <label className="field">
            <span className="required">Condition</span>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} required>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </label>

          <div className="row">
            <label className="field small">
              <span className="required">Price</span>
              <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>

            <label className="field small">
              <span className="required">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* ISBN field for books */}
          {category === "books" && (
            <label className="field">
              <span>ISBN (optional)</span>
              <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
            </label>
          )}

          <div className="actions row">
            <button type="submit" className="primary">Save Changes</button>
            <button type="button" className="secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
