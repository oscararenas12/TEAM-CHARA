'use client'

import React, { useRef, useState } from "react"
import "../styles.css"

export default function SellPage() {
  const [images, setImages] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const urls: string[] = Array.from(files).map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...urls].slice(0, 10)) // limit previews to 10
    // reset input so same file can be selected again if needed
    if (fileRef.current) fileRef.current.value = ""
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // For now just log the payload. Integration with backend can be added later.
    console.log({ title, description, price, category, images })
    alert("Listing created (demo). Check console for payload.")
    // clear form (optional)
    setTitle("")
    setDescription("")
    setPrice("")
    setCategory("")
    setImages([])
  }

  return (
    <div className="sell-page">
      <h1 id="title">Sell Page</h1>

      <div className="create-listing">
        <h2>Create Listing</h2>
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

            {/* Add-photo tile lives inside the photos container */}
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
              <div className="add-inner">
                <div className="plus">+</div>
                <div className="add-text">Add Photos</div>
                <div className="small-note">
                  You can add multiple images (up to 10)
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="box item-details">
        <h3>Item Details</h3>
        <form onSubmit={handleSubmit} className="item-form">
          <label className="field">
            <span className="required">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short, descriptive title"
              required
            />
          </label>

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
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <div className="actions">
            <button type="submit" className="primary">
              Create Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
