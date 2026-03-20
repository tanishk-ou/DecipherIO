"use client";

import { useState } from "react";
import { getPendingReviews, approveReview, rejectReview } from "./actions";
import { Button } from "@/components/ui/button";
import { Check, X, Lock, Loader2, PlayCircle } from "lucide-react";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const res = await getPendingReviews(password);
    
    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.data) {
      setReviews(res.data);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  // Handle Approve
  const handleApprove = async (id: number) => {
    const res = await approveReview(id, password);
    if (res.success) {
      // Remove the approved review from the screen
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      alert("Failed to approve: " + res.error);
    }
  };

  // Handle Reject
  const handleReject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    
    const res = await rejectReview(id, password);
    if (res.success) {
      // Remove the rejected review from the screen
      setReviews(reviews.filter((r) => r.id !== id));
    } else {
      alert("Failed to reject: " + res.error);
    }
  };

  // --- UI: LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg border max-w-sm w-full space-y-4">
          <div className="flex justify-center mb-6"><Lock className="text-gray-400 w-12 h-12" /></div>
          <h1 className="text-2xl font-bold text-center">Admin Access</h1>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter Master Password"
            className="w-full border p-3 rounded-lg"
            required
          />
          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          <Button type="submit" disabled={isLoading} className="w-full py-6">
            {isLoading ? <Loader2 className="animate-spin" /> : "Unlock Dashboard"}
          </Button>
        </form>
      </div>
    );
  }

  // --- UI: DASHBOARD SCREEN ---
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Pending Reviews</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {reviews.length} Awaiting Approval
            </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-2xl">
            No pending reviews to approve! 🎉
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-lg">{review.name}</h2>
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                        {review.type === "text" ? "Written Review" : "Video Review"}
                    </span>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  {review.type === "text" ? (
                    <p className="text-gray-700 italic">"{review.content}"</p>
                  ) : (
                    <a href={review.content} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                        <PlayCircle size={16} /> Watch Video File
                    </a>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={() => handleApprove(review.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2">
                    <Check size={16} /> Approve
                  </Button>
                  <Button onClick={() => handleReject(review.id)} variant="outline" className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 gap-2">
                    <X size={16} /> Reject
                  </Button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}