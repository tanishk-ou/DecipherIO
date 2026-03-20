"use client";

import { useState } from "react";
import { Star, PlayCircle, Plus, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import MagicText from "@/components/magic-text";

// Dummy data for Phase 1 (Replace with DB fetch later)
const MOCK_TEXT_REVIEWS = [
  { id: 1, name: "Sarah J.", role: "Student", text: "Decipher.io completely changed how I read research papers." },
  { id: 2, name: "Mark T.", role: "Teacher", text: "I recommend this extension to all my students." },
];

export default function ReviewsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewType, setReviewType] = useState<"text" | "video">("text");

  // Form State
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", reviewType);
      
      if (reviewType === "text") formData.append("content", content);
      if (reviewType === "video" && videoFile) formData.append("video", videoFile);

      // Call the API route we just made
      const res = await fetch('/api/reviews', { 
        method: 'POST', 
        body: formData 
      });

      if (!res.ok) throw new Error("Failed to upload");

      alert("Review submitted! It will appear once approved.");
      setIsModalOpen(false);
      // Reset form fields here if you want
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 w-full flex justify-center">
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <MagicText tag="h3" text="Community Stories" className="text-[2.5em] font-bold" />
            <p className="text-[1.1em] opacity-80 mt-2">See how Decipher.io helps readers worldwide.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-full px-6 py-4 shadow-md bg-black hover:bg-gray-800 text-white flex gap-2">
            <Plus size={18} /> Share Your Story
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Text Reviews */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><Star className="text-yellow-500 fill-yellow-500" size={20}/> Written Reviews</h4>
            <div className="grid gap-4">
              {MOCK_TEXT_REVIEWS.map((r) => (
                <div key={r.id} className="bg-white/50 backdrop-blur border p-6 rounded-2xl shadow-sm">
                  <p className="italic mb-4 text-gray-700">"{r.text}"</p>
                  <p className="font-bold">{r.name} <span className="text-sm font-normal text-gray-500">- {r.role}</span></p>
                </div>
              ))}
            </div>
          </div>

          {/* Video Reviews */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-2 border-b pb-2"><PlayCircle className="text-blue-500" size={20}/> Video Experiences</h4>
            <div className="grid grid-cols-2 gap-4">
              {/* Placeholder Video Card */}
              <div className="bg-gray-900 rounded-2xl aspect-[9/16] relative overflow-hidden group cursor-pointer flex items-center justify-center">
                 <PlayCircle size={40} className="text-white opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                 <p className="absolute bottom-4 text-white text-sm font-medium">Alex's Setup</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- UPLOAD MODAL --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                <X size={16} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Submit a Review</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4 mb-6">
                   <Button type="button" variant={reviewType === "text" ? "default" : "outline"} onClick={() => setReviewType("text")} className="flex-1">Text</Button>
                   <Button type="button" variant={reviewType === "video" ? "default" : "outline"} onClick={() => setReviewType("video")} className="flex-1">Video</Button>
                </div>

                <div>
                  <label className="text-sm font-bold mb-1 block">Your Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-3" placeholder="John Doe" />
                </div>

                {reviewType === "text" ? (
                  <div>
                    <label className="text-sm font-bold mb-1 block">Your Experience</label>
                    <textarea required value={content} onChange={e => setContent(e.target.value)} className="w-full border rounded-lg p-3 min-h-[120px]" placeholder="How has Decipher.io helped you?" />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-bold mb-1 block">Upload Video (Max 50MB)</label>
                    <div className="border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                       <Upload className="text-gray-400" />
                       <input required type="file" accept="video/mp4,video/webm" onChange={e => setVideoFile(e.target.files?.[0] || null)} className="text-sm w-full max-w-[200px]" />
                    </div>
                  </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full py-6 mt-4 text-lg rounded-xl">
                  {isSubmitting ? "Uploading..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}