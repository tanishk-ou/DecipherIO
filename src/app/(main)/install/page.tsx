import { Download, Settings, ToggleRight, FolderOpen, Puzzle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MagicText from "@/components/magic-text";

const STEPS = [
  {
    icon: <Download className="w-8 h-8 text-blue-500" />,
    title: "1. Download & Extract",
    description: "Download the decipher.io extension zip file and extract (unzip) it to a folder on your computer."
  },
  {
    icon: <Settings className="w-8 h-8 text-gray-700" />,
    title: "2. Open Extensions Page",
    description: "Open Google Chrome, type chrome://extensions/ in the URL bar, and press Enter."
  },
  {
    icon: <ToggleRight className="w-8 h-8 text-green-500" />,
    title: "3. Enable Developer Mode",
    description: "In the top right corner of the Extensions page, toggle 'Developer mode' to ON."
  },
  {
    icon: <FolderOpen className="w-8 h-8 text-yellow-500" />,
    title: "4. Load Unpacked",
    description: "Click the 'Load unpacked' button in the top left and select the folder you extracted in Step 1."
  },
  {
    icon: <Puzzle className="w-8 h-8 text-indigo-500" />,
    title: "5. Pin & Use",
    description: "Click the puzzle piece icon in your Chrome toolbar and pin decipher.io for easy access!"
  }
];

export default function InstallGuide() {
  return (
    // Replaced standard div with your globally matching wrapper
    <div className="flex flex-col min-h-screen px-10 py-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 mb-8 text-[1.1em] opacity-70 hover:opacity-100 transition-opacity w-fit font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>

        <div className="text-center mb-16">
          <MagicText tag="h1" text="How to Install Decipher.io" className="text-[3em] font-bold mb-4" />
          <MagicText text="Since we are in early access, you will need to install the extension manually. It only takes 30 seconds!" className="text-[1.1em] opacity-90" />
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-transparent">
          {STEPS.map((step, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-gray-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {step.icon}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-black/5 p-8 rounded-2xl border border-black/10 hover:shadow-md transition-shadow">
                <MagicText tag="h3" text={step.title} className="font-bold text-[1.5em] mb-3" />
                <MagicText text={step.description} className="text-[1.1em] opacity-80" />
              </div>
              
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
           <Button asChild className="rounded-full px-8 py-6 text-[1.1em] w-fit bg-blue-600 hover:bg-blue-700 shadow-lg text-white">
              <a href="/decipher-extension.zip" download>
                Download Extension Now <ArrowRight className="ml-2 w-5 h-5" />
              </a>
           </Button>
        </div>

      </div>
    </div>
  );
}