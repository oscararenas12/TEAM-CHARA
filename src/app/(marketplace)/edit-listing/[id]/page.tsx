'use client';

import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../styles.css";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/shared/Spinner";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = String(params.id);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // State for form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("other");
  const [condition, setCondition] = useState("like-new");
  const [isbn, setIsbn] = useState("");

  // State for images
  const [existingImages, setExistingImages] = useState<Array<{ url: string; id?: string; display_order: number }>>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch item data from Supabase on mount
  useEffect(() => {
    async function fetchItem() {
      try {
        const supabase = createClient();

        const { data: item, error: itemError } = await supabase
          .from("items")
          .select(
            `
            id,
            name,
            description,
            price,
            condition,
            categories:category_id (
              name
            ),
            item_images (
              id,
              image_url,
              display_order
            ),
            item_tags (
              tag
            )
          `
          )
          .eq("id", listingId)
          .single();

        if (itemError) {
          console.error("Error fetching item:", itemError);
          setError("Failed to load listing");
          return;
        }

        if (!item) {
          setError("Listing not found");
          return;
        }

        // Set form fields
        setTitle(item.name);
        setDescription(item.description || "");
        setPrice(item.price.toString());
        setCondition(item.condition || "like-new");

        // Handle category
        const categoryObj = Array.isArray(item.categories) ? item.categories[0] : item.categories;
        setCategory(categoryObj?.name?.toLowerCase() || "other");

        // Handle existing images
        const images = (item.item_images || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((img: any) => ({
            url: img.image_url,
            id: img.id,
            display_order: img.display_order,
          }));
        setExistingImages(images);

        // Handle ISBN from tags
        const isbnTag = item.item_tags?.find((tag: any) => tag.tag.startsWith("ISBN:"));
        if (isbnTag) {
          setIsbn(isbnTag.tag.replace("ISBN: ", ""));
        }
      } catch (err) {
        console.error("Unexpected error fetching item:", err);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [listingId]);

  // Clear ISBN if category is not books
  useEffect(() => {
    if (category !== "books") setIsbn("");
  }, [category]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    const currentTotalImages = existingImages.length + newImageFiles.length;
    const availableSlots = 6 - currentTotalImages;

    if (availableSlots <= 0) {
      alert("Maximum 6 photos allowed");
      return;
    }

    const filesToAdd = filesArray.slice(0, availableSlots);
    const urls = filesToAdd.map((f) => URL.createObjectURL(f));

    setNewImageFiles((prev) => [...prev, ...filesToAdd]);
    setNewImagePreviews((prev) => [...prev, ...urls]);

    if (fileRef.current) fileRef.current.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    const totalImages = existingImages.length + newImageFiles.length;
    if (totalImages === 0) {
      setError("Please add at least one photo");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // 1. Get category ID from category name
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", category)
        .single();

      if (categoryError) {
        throw new Error(`Category not found: ${category}`);
      }

      // 2. Update the item
      const { error: updateError } = await supabase
        .from("items")
        .update({
          category_id: categoryData.id,
          name: title,
          description,
          price: parseFloat(price.replace(/[^0-9.]/g, "")),
          condition,
        })
        .eq("id", listingId);

      if (updateError) throw updateError;

      // 3. Handle images - delete old images that were removed
      const { data: currentImages } = await supabase
        .from("item_images")
        .select("id, image_url")
        .eq("item_id", listingId);

      const keptImageUrls = existingImages.map((img) => img.url);
      const imagesToDelete = currentImages?.filter((img) => !keptImageUrls.includes(img.image_url)) || [];

      // Delete removed images from database and storage
      for (const img of imagesToDelete) {
        // Delete from database
        await supabase.from("item_images").delete().eq("id", img.id);

        // Delete from storage (extract file path from URL)
        const urlParts = img.image_url.split("/item-images/");
        if (urlParts.length > 1) {
          const filePath = urlParts[1].split("?")[0]; // Remove query params
          await supabase.storage.from("item-images").remove([filePath]);
        }
      }

      // 4. Upload new images
      const imageUploadPromises = newImageFiles.map(async (file, index) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${listingId}/${Date.now()}-${index}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("item-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("item-images").getPublicUrl(fileName);

        // Insert into item_images table with correct display_order
        const displayOrder = existingImages.length + index;
        const { error: imageError } = await supabase.from("item_images").insert({
          item_id: listingId,
          image_url: publicUrl,
          display_order: displayOrder,
        });

        if (imageError) throw imageError;
      });

      await Promise.all(imageUploadPromises);

      // 5. Update display_order for existing images
      for (let i = 0; i < existingImages.length; i++) {
        const img = existingImages[i];
        if (img.id) {
          await supabase
            .from("item_images")
            .update({ display_order: i })
            .eq("id", img.id);
        }
      }

      // 6. Handle ISBN tags
      // Delete old ISBN tags
      await supabase
        .from("item_tags")
        .delete()
        .eq("item_id", listingId)
        .ilike("tag", "ISBN:%");

      // Add new ISBN tag if provided
      if (isbn && category === "books") {
        await supabase.from("item_tags").insert({
          item_id: listingId,
          tag: `ISBN: ${isbn}`,
        });
      }

      setSuccess("Listing updated successfully! Redirecting...");

      // Cleanup object URLs
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 2000);
    } catch (err) {
      console.error("Error updating listing:", err);
      setError(err instanceof Error ? err.message : "Failed to update listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Cleanup object URLs
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    router.back();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="sell-page">
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={() => router.push("/profile")}>Back to Profile</button>
      </div>
    );
  }

  const allImages = [...existingImages.map((img) => ({ type: "existing" as const, url: img.url })), ...newImagePreviews.map((url) => ({ type: "new" as const, url }))];

  return (
    <div className="sell-page">
      <div className="create-listing">
        <h2 id="page-head">Edit Listing</h2>
        <p className="subtext">Update your item details</p>
      </div>

      {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}
      {success && <p style={{ color: "green", margin: "10px 0" }}>{success}</p>}

      {/* Photos */}
      <div className="photos-wrapper">
        <div className="box photos-see">
          <h3>Photos</h3>
          <div className="photos-container">
            {existingImages.map((img, i) => (
              <div className="photo-preview" key={`existing-${i}`}>
                <img src={img.url} alt={`preview-${i}`} />
                <button
                  type="button"
                  className="remove-photo"
                  onClick={() => removeExistingImage(i)}
                  disabled={isSubmitting}
                >
                  X
                </button>
              </div>
            ))}

            {newImagePreviews.map((url, i) => (
              <div className="photo-preview" key={`new-${i}`}>
                <img src={url} alt={`new-preview-${i}`} />
                <button
                  type="button"
                  className="remove-photo"
                  onClick={() => removeNewImage(i)}
                  disabled={isSubmitting}
                >
                  X
                </button>
              </div>
            ))}

            {allImages.length < 6 && (
              <label className="add-photo-tile">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFiles}
                  style={{ display: "none" }}
                  disabled={isSubmitting}
                />
                <div className="add-inner">
                  <div className="plus">+</div>
                  <div className="add-text">Add Photos</div>
                  <div className="small-note">{allImages.length}/6 photos</div>
                </div>
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="item-details">
        <h3>Edit Details</h3>
        <form onSubmit={handleSave} className="item-form">
          <label className="field">
            <span className="required">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="field">
            <span className="required">Description</span>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="field">
            <span className="required">Condition</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              disabled={isSubmitting}
            >
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </label>

          <div className="row">
            <label className="field small">
              <span className="required">Price</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className="field small">
              <span className="required">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={isSubmitting}
              >
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
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                disabled={isSubmitting}
              />
            </label>
          )}

          <div className="actions row">
            <button type="submit" className="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
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
        </form>
      </div>
    </div>
  );
}
