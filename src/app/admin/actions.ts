"use server";

import { createClient } from '@supabase/supabase-js';

// Use the Service Role Key for admin privileges
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAdminKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseAdminKey);

const ADMIN_PASS = process.env.ADMIN_PASSWORD;

// 1. Fetch unapproved reviews (Requires Password)
export async function getPendingReviews(password: string) {
  if (password !== ADMIN_PASS) return { error: "Incorrect Password" };

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: true });

  if (error) return { error: error.message };
  return { data };
}

// 2. Approve a review
export async function approveReview(id: number, password: string) {
  if (password !== ADMIN_PASS) return { error: "Unauthorized" };

  const { error } = await supabase
    .from('reviews')
    .update({ approved: true })
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}

// 3. Reject/Delete a review
export async function rejectReview(id: number, password: string) {
  if (password !== ADMIN_PASS) return { error: "Unauthorized" };

  // Note: If they uploaded a video, you might also want to delete the file from the storage bucket here to save space!
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}