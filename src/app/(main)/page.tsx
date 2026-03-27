"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MagicText from "@/components/magic-text"; 
import ReviewsSection from "@/components/reviews-section";
import { ChevronRight } from "lucide-react";

const isSupabaseConfigured = 
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
  !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export default function Home() {
  return (
    // Transparent background so the Sidebar theme shows through
    <div className="flex flex-col min-h-screen px-10 py-10 transition-colors duration-300">

      {/* ================= UPLOAD SECTION ================= */}
      <section className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-16 max-w-6xl w-full">
          
          {/* TEXT */}
          <div className="flex flex-col gap-6 max-w-xl">
            <MagicText 
              tag="h3" 
              text="A Gift for Creative Thinkers" 
              className="text-[2.5em] font-bold" 
            />

            <div className="space-y-4">
              <MagicText 
                text="Convert text from PDFs, photos, and scanned images into a dyslexia-friendly format." 
                className="text-[1.1em] opacity-90" 
              />
              <MagicText 
                text="Making it more readable and easily understandable." 
                className="text-[1.1em] opacity-90" 
              />
            </div>

            <Button asChild className="rounded-full px-8 py-6 text-[1.1em] w-fit shadow-lg hover:scale-105 transition-transform mt-4">
              {/* Changed button text to be more inclusive */}
              <Link href="/upload">Upload File</Link>
            </Button>
          </div>

          {/* IMAGE - Clean container with no borders */}
          <div className="relative flex items-center justify-center">
             <Image 
                src="/card.png" 
                width={400} 
                height={400} 
                alt="Upload File or Image" 
                className="object-contain drop-shadow-xl"
             />
          </div>
        </div>
      </section>

      {/* ================= EXTENSION SECTION ================= */}
      <section className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-16 max-w-6xl w-full">
          
           {/* IMAGE */}
           <div className="relative flex items-center justify-center">
             <Image 
                src="/image.png" 
                width={280} 
                height={280} 
                alt="Extension" 
                className="object-contain drop-shadow-xl"
             />
          </div>

          <div className="flex flex-col gap-6 max-w-xl text-right items-end">
            <MagicText 
              tag="h3" 
              text="Download Extension" 
              className="text-[2.5em] font-bold" 
            />

            <MagicText 
              text="Simple-to-use open source dyslexia reader helper." 
              className="text-[1.1em] opacity-90" 
            />

            {/* Direct Download Button */}
            <Button asChild className="rounded-full px-8 py-6 text-[1.1em] w-fit bg-blue-600 hover:bg-blue-700 shadow-lg text-white mt-4">
              <a href="/decipher-extension.zip" download>
                Download for Chrome
              </a>
            </Button>
            
            <Link 
              href="/install" 
              className="group flex items-center gap-1 mt-3 text-[0.95em] font-medium text-gray-500 hover:text-blue-600 transition-colors"
            >
              How do I install this?
              {/* Swapped to Chevron, made slightly smaller, and added a tiny top margin for perfect baseline alignment */}
              {/* <MoveRight className="w-4 h-4 mt-[1px] transition-transform group-hover:translate-x-1" /> */}
              <ChevronRight className="w-4 h-4 ml-0.5 mt-[2px] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* ================= REVIEWS SECTION ================= */}
      {isSupabaseConfigured ? (
        <ReviewsSection />
      ) : (
        <section className="py-20 w-full flex justify-center">
          <div className="max-w-6xl w-full">
             <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-3xl bg-white/40 text-center">
                <MagicText tag="h3" text="Community Stories" className="text-[2.5em] font-bold opacity-40" />
                <p className="text-[1.1em] opacity-60 mt-2 max-w-lg">
                  See how Decipher.io helps readers worldwide.
                </p>
                {/* UPDATED: Increased padding, better contrast, and relative 'em' sizing */}
                <div className="mt-8 bg-gray-100/90 px-8 py-4 rounded-xl border border-gray-200">
                   <p className="text-[1em] text-gray-800 font-bold">
                     Community Reviews are currently disabled in local development. 
                   </p>
                   <p className="text-[0.9em] text-gray-600 mt-1 font-medium">
                     Configure Supabase environment variables to enable this feature, or visit the live deployment.
                   </p>
                </div>
             </div>
          </div>
        </section>
      )}

      {/* ================= RESOURCE SECTION ================= */}
      <section className="flex items-center justify-center min-h-[50vh]">
        <div className="flex items-center gap-16 max-w-6xl w-full">
          
          <div className="flex flex-col gap-6 max-w-xl">
            <MagicText 
              tag="h3" 
              text="ADHD & Dyslexia Resources" 
              className="text-[2.5em] font-bold" 
            />

            <div className="space-y-1 text-[1.1em] opacity-90">
                <MagicText text="Curated tools for focus," />
                <MagicText text="Professional support directories, and" />
                <MagicText text="Community study strategies." />
            </div>

            <Button asChild className="rounded-full px-8 py-6 text-[1.1em] w-fit bg-orange-500 hover:bg-orange-600 shadow-lg text-white mt-4">
              <Link href="/resources">
                Explore Resources
              </Link>
            </Button>
          </div>

          {/* IMAGE */}
          <div className="relative flex items-center justify-center">
             <Image 
                src="/Counsellor.png" 
                width={380} 
                height={380} 
                alt="Support Resources" 
                className="object-contain drop-shadow-xl"
             />
          </div>
        </div>
      </section>

    </div>
  );
}