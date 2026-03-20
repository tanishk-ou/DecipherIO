import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the NEW keys
const supabaseUrl = process.env.NEXT_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;

    let contentToSave = "";

    // Handle Text Review
    if (type === 'text') {
      contentToSave = formData.get('content') as string;
    } 
    // Handle Video Upload
    else if (type === 'video') {
      const file = formData.get('video') as File;
      if (!file) return NextResponse.json({ error: "No video provided" }, { status: 400 });

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL to save in the database
      const { data: publicUrlData } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      contentToSave = publicUrlData.publicUrl;
    }

    // Save the record to the Database
    const { error: dbError } = await supabase
      .from('reviews')
      .insert([{ name, type, content: contentToSave, approved: false }]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, message: "Review submitted successfully!" });

  } catch (error) {
    console.error("Submission Error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}