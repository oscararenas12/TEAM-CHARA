"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import "../../styles.css";
import backImg from "@/assets/back.png";
import messageImg from "@/assets/message.png";
import laptopImg from "@/assets/laptop.jpeg";
import { createClient } from "@/lib/supabase/client";
import Spinner from "@/components/shared/Spinner";
import Carousel from "@/components/shared/Carousel";

interface Item {
  id: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  postedBy: {
    id: string;
    name: string;
    profilePic?: string;
  };
  condition: string;
  category: string;
  isbn?: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  const router = useRouter();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);

        const { data, error } = await supabase
          .from("items")
          .select(`
            id,
            name,
            description,
            price,
            condition,
            seller_id,
            profiles:seller_id (
              id,
              first_name,
              last_name,
              avatar_url
            ),
            categories:category_id (
              name
            ),
            item_images (
              image_url,
              display_order
            ),
            item_tags (
              tag
            )
          `)
          .eq("id", itemId)
          .single();

        if (error || !data) {
          setError("Item not found");
          return;
        }

        const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
        const category = Array.isArray(data.categories) ? data.categories[0] : data.categories;

        if (!data.seller_id) {
          setError("Invalid item data");
          return;
        }

        let isbnTag = data.item_tags?.find((tag: any) => tag.tag.startsWith("ISBN:"));
        let isbn = isbnTag ? isbnTag.tag.replace("ISBN: ", "") : undefined;

        if (isbn) {
          const cleanIsbn = isbn.replace(/[-\s]/g, "");
          if (cleanIsbn.length === 13) {
            const prefix = cleanIsbn.substring(0, 3);
            const group = cleanIsbn.substring(3, 4);
            const registrant = cleanIsbn.substring(4, 7);
            const publication = cleanIsbn.substring(7, 12);
            const check = cleanIsbn.substring(12, 13);
            isbn = `${prefix}-${group}-${registrant}-${publication}-${check}`;
          }
        }

        setItem({
          id: data.id,
          name: data.name,
          description: data.description || "No description provided",
          price: `$${parseFloat(data.price).toFixed(2)}`,
          category: category?.name || "Other",
          condition: data.condition || "good",
          isbn: isbn,
          postedBy: {
            id: data.seller_id,
            name: profile
              ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Unknown"
              : "Unknown",
            profilePic: profile?.avatar_url || "",
          },
          images: data.item_images
            ?.toSorted((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url) || [laptopImg.src],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load item");
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [itemId]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner />
    </div>
  );
  if (error || !item) return <p className="no-items">{error || "Item not found!"}</p>;

  const sendQuickMessage = (text: string) => {
    router.push(
      `/messages?autoMessage=${encodeURIComponent(text)}&to=${encodeURIComponent(item.postedBy.id)}`
    );
  };

  return (
    <div className="item-detail">
      {/* Back button */}
      <Link href="/home" className="back-button">
        <img id="backbut" src={backImg.src} alt="Go home" />
      </Link>

      {/* Carousel */}
      <div className="box item-images-box">
        <Carousel images={item.images} alt={item.name} />
      </div>

      {/* Item Info */}
      <div className="item-info-box">
        <p>{item.name}</p>
        <p className="item-price">{item.price}</p>
      </div>

      {/* Condition */}
      <div className="box condition1">
        <h3>Condition:</h3>
        <p className="condition">{item.condition}</p>
      </div>

      {/* Description */}
      <div className="box description">
        <h3>Description</h3>
        <p className="item-description" style={{ whiteSpace: "pre-wrap" }}>
          {item.description}
        </p>
      </div>

      {/* ISBN */}
      {item.isbn && (
        <div className="box isbn-box">
          <h3>ISBN</h3>
          <p className="item-isbn">{item.isbn}</p>
        </div>
      )}

      {/* Seller Info */}
      <div className="box seller-info-box">
        <h3>Seller Information</h3>
        <div className="seller-info-box1">
          <div className="seller-info-box3">
            <div className="seller-avatar">
              {item.postedBy.profilePic ? (
                <img src={item.postedBy.profilePic} alt={item.postedBy.name} />
              ) : (
                item.postedBy.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="seller-info-box2">
              <p>{item.postedBy.name}</p>
            </div>
          </div>
          <Link href={`/publicprofile/${item.postedBy.id}`} className="seller-link">
            <button>View Profile</button>
          </Link>
        </div>
      </div>

      {/* Quick Questions - Only show for other users' items */}
      {currentUserId !== item.postedBy.id && (
        <div className="box quick-questions-box">
          <h3>Quick Questions</h3>
          <div className="questions">
            {[
              "Is this available?",
              "Can I pick up tomorrow?",
              "What's the condition like?",
              "Can you send more photos?",
            ].map((q, i) => (
              <div key={i} className="question" onClick={() => sendQuickMessage(q)}>
                <p>
                  <img src={messageImg.src} /> {q}
                </p>
              </div>
            ))}
            <Link href={`/messages?to=${encodeURIComponent(item.postedBy.id)}`}>
              <button className="question-send">Send Message</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
