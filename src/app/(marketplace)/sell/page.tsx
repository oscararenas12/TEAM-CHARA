'use client';

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";
import "../styles.css";

export default function SellPage() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useUserProfile();
  const [images, setImages] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [isbn, setIsbn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actualFiles, setActualFiles] = useState<File[]>([]);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setActualFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!profile) {
      setError("You must be logged in to create a listing");
      return;
    }

    if (actualFiles.length === 0) {
      setError("Please add at least one photo");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // 1. Get category ID from category name
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        
        .select('id')
        .ilike('name', category)
        .single();

      if (categoryError) {
        throw new Error(`Category not found: ${category}`);
      }

      // 2. Create the item
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({
          seller_id: profile.id,
          category_id: categoryData.id,
          name: title,
          description,
          price: parseFloat(price.replace(/[^0-9.]/g, '')), // remove $ and other chars
          condition,
          is_available: true,
          created_at: new Date().toISOString(),
        })
        
        .select()
        .single();

      if (itemError) throw itemError;

      // 3. Upload images to Supabase Storage and create item_images records
      const imageUploadPromises = actualFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${itemData.id}/${Date.now()}-${index}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName);

        // Insert into item_images table
        const { error: imageError } = await supabase
          .from('item_images')
          .insert({
            item_id: itemData.id,
            image_url: publicUrl,
            display_order: index,
          });

        if (imageError) throw imageError;
      });

      await Promise.all(imageUploadPromises);

      // 4. If ISBN provided, add as tag
      if (isbn) {
        await supabase.from('item_tags').insert({
          item_id: itemData.id,
          tag: `ISBN: ${isbn}`,
        });
      }

      // Success! Show message and clear form
      setSuccess("Listing created successfully! Redirecting to your profile...");
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setCondition("");
      setIsbn("");
      images.forEach((url) => URL.revokeObjectURL(url));
      setImages([]);
      setActualFiles([]);
      if (fileRef.current) fileRef.current.value = "";

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCategory("");
    setCondition("");
    setIsbn("");
    setError(null);
    setSuccess(null);
    images.forEach((url) => URL.revokeObjectURL(url));
    setImages([]);
    setActualFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const filesArray = Array.from(files);
    const urls: string[] = filesArray.map((f) => URL.createObjectURL(f));

    setImages((prev) => [...prev, ...urls].slice(0, 6)); // limit previews to 6
    setActualFiles((prev) => [...prev, ...filesArray].slice(0, 6)); // store actual files

    // reset input so same file can be selected again if needed
    if (fileRef.current) fileRef.current.value = "";
  };


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
        {error && (
          <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', borderRadius: '5px', marginTop: '10px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: 'green', padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '5px', marginTop: '10px' }}>
            {success}
          </div>
        )}
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

          {/* Condition Input */}
          <label className="field">
            <span className="required">Condition</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
            >
              <option value="" disabled>Select condition</option>
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
                <option value="" disabled>Select category</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="clothing">Clothing</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* ISBN Input */}
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
              <button type="submit" className="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={handleCancel}
                disabled={isSubmitting}
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
