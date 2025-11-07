"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../styles.css";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/lib/supabase/client";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, loading: profileLoading } = useUserProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length === 0) return "";
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6)
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  // Load current profile data when available
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      // Format phone number when loading
      const formattedPhone = profile.phone
        ? formatPhoneNumber(profile.phone)
        : "";
      setPhone(formattedPhone);
      setBio(profile.bio || "");
      setPhoto(profile.avatar_url || "");
    }
  }, [profile]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      if (!profile) {
        throw new Error("No profile found");
      }

      const supabase = createClient();
      let avatarUrl = profile.avatar_url;

      // Upload photo if changed
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${profile.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, photoFile, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          bio: bio,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");

      // Redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (profileLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      {/* ✅ Header */}
      <div className="edit-profile-header">
        <div>
          <h2>Edit Profile</h2>
          <p>Update your information below</p>
          {error && (
            <div
              style={{
                color: "red",
                padding: "10px",
                backgroundColor: "#ffebee",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                color: "green",
                padding: "10px",
                backgroundColor: "#e8f5e9",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            >
              {success}
            </div>
          )}
        </div>
        <div className="edit-profile-img-wrapper">
          {photo ? (
            <img
              className="edit-profile-img"
              alt={`${firstName} ${lastName}`}
              src={photo}
            />
          ) : (
            <div className="edit-profile-img profile-pic-placeholder">
              {firstName?.[0]}
              {lastName?.[0]}
            </div>
          )}

          <label htmlFor="photo-upload" className="change-photo-btn">
            Change photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
        </div>
      </div>

      {/* ✅ Form */}
      <div className="edit-form">
        <div>
          <label>First Name</label>
          <input
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            name="phone"
            value={phone}
            onChange={handlePhoneChange}
            type="tel"
            placeholder="(123) 456-7890"
            maxLength={14}
          />
        </div>

        <div>
          <label>Bio</label>
          <textarea
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="edit-actions">
        <button className="edit-btn cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button className="edit-btn save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
