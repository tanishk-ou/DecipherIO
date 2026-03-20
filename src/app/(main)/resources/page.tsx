import { ExternalLink, BrainCircuit, Users, BookOpen, Headset, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import MagicText from "@/components/magic-text";

const RESOURCES = [
  {
    category: "Professional Organizations",
    icon: <Users className="w-7 h-7 text-blue-500" />,
    items: [
      { name: "CHADD (Children and Adults with ADHD)", url: "https://chadd.org/", desc: "The nation's leading non-profit organization serving people with ADHD." },
      { name: "International Dyslexia Association", url: "https://dyslexiaida.org/", desc: "Global organization providing research, education, and advocacy." },
      { name: "Understood.org", url: "https://www.understood.org/", desc: "Resources and support for individuals who learn and think differently." }
    ]
  },
  {
    category: "Focus & Productivity Tools",
    icon: <BrainCircuit className="w-7 h-7 text-orange-500" />,
    items: [
      { name: "Pomofocus", url: "https://pomofocus.io/", desc: "A customizable Pomodoro timer that works on desktop and mobile browser." },
      { name: "Cold Turkey", url: "https://getcoldturkey.com/", desc: "The toughest website blocker on the internet to eliminate distractions." },
      { name: "Habitica", url: "https://habitica.com/", desc: "Gamify your tasks and habits to stay motivated and organized." }
    ]
  },
  {
    category: "Study Strategies",
    icon: <BookOpen className="w-7 h-7 text-green-500" />,
    items: [
      { name: "How to ADHD (YouTube)", url: "https://www.youtube.com/c/howtoadhd", desc: "A comprehensive toolbox of videos detailing strategies for ADHD brains." },
      { name: "The SQ3R Reading Method", url: "https://en.wikipedia.org/wiki/SQ3R", desc: "Survey, Question, Read, Recite, Review - a proven comprehension method." }
    ]
  },
  {
    category: "Audio & Ambiance",
    icon: <Headset className="w-7 h-7 text-purple-500" />,
    items: [
      { name: "Brain.fm", url: "https://www.brain.fm/", desc: "Functional music designed to elicit strong neural phase locking for focus." },
      { name: "MyNoise", url: "https://mynoise.net/", desc: "Customizable background noises and soundscapes to drown out distractions." }
    ]
  }
];

export default function ResourcesPage() {
  return (
    // Replaced standard div with your globally matching wrapper
    <div className="flex flex-col min-h-screen px-10 py-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 mb-8 text-[1.1em] opacity-70 hover:opacity-100 transition-opacity w-fit font-medium">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <div className="mb-16">
          <MagicText tag="h1" text="Support & Resources" className="text-[3em] font-bold mb-4" />
          <MagicText text="Decipher.IO is just one tool in your toolkit. Explore these highly-rated organizations, strategies, and apps designed to help you thrive." className="text-[1.2em] opacity-90 max-w-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RESOURCES.map((section, idx) => (
            <div key={idx} className="bg-black/5 rounded-3xl p-8 border border-black/10">
              <div className="flex items-center gap-4 mb-8 border-b border-black/10 pb-4">
                {section.icon}
                <MagicText tag="h2" text={section.category} className="text-[1.8em] font-bold" />
              </div>
              
              <ul className="space-y-8">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="group">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                      <h3 className="text-[1.2em] font-bold flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                        <MagicText text={item.name} /> <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <MagicText text={item.desc} className="text-[1em] opacity-80 mt-2" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-16 border-t border-black/10 text-center flex flex-col items-center">
            <MagicText tag="h3" text="Did we miss something?" className="text-[2em] font-bold mb-4" />
            <MagicText text="If you know of a great resource that should be on this list, let us know!" className="text-[1.1em] opacity-80 mb-6" />
            {/* ✅ NEW (Working email link) */}
            <Button asChild variant="outline" className="rounded-full px-8 py-6 text-[1.1em] w-fit shadow-md bg-transparent border-black/20 hover:bg-black/5">
                <a href="mailto:gopalanitanishk@gmail.com?subject=New%20Resource%20Suggestion%20for%20Decipher.IO">
                    Suggest a Resource
                </a>
            </Button>
        </div>

      </div>
    </div>
  );
}