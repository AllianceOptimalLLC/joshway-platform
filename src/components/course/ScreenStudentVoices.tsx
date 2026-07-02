import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { EASE_NARRATIVE, DURATIONS } from "@/lib/academy/motion";

import ayeikaPhoto from "@/assets/students/ayeika.png.asset.json";
import camPhoto from "@/assets/students/cam.png.asset.json";
import peterPhoto from "@/assets/students/peter.png.asset.json";
import ayeikaAudio from "@/assets/students/ayeika.mp3.asset.json";
import camAudio from "@/assets/students/cam.mp3.asset.json";
import peterAudio from "@/assets/students/peter.mp3.asset.json";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

interface Student {
  name: string;
  quote: string;
  story: string;
  photo: string;
  audio: string;
  initials: string;
  tags: { icon: string; label: string }[];
}

const students: Student[] = [
  {
    name: "Ayeika",
    initials: "AY",
    photo: ayeikaPhoto.url,
    audio: ayeikaAudio.url,
    quote: "Music gave me confidence. Purpose gave me direction.",
    tags: [
      { icon: "🎵", label: "Music" },
      { icon: "🎤", label: "Creativity" },
      { icon: "⭐", label: "Leadership" },
    ],
    story:
      "Ayeika, a proud Louis E. Dieruff graduate and lifelong El Sistema participant, blends her love of music with purpose. She dreams of becoming a singer-songwriter and pursuing justice to uplift others.",
  },
  {
    name: "Camden",
    initials: "CA",
    photo: camPhoto.url,
    audio: camAudio.url,
    quote: "Leadership starts when you decide to stand up.",
    tags: [
      { icon: "🎾", label: "Athletics" },
      { icon: "🎮", label: "Creativity" },
      { icon: "⭐", label: "Leadership" },
    ],
    story:
      "Camden, 16, from Hellertown, Pennsylvania, brings energy and optimism to tennis, running, and gaming. Through JOSHWAY, he's learning that leadership means standing up for what matters and sparking real change.",
  },
  {
    name: "Peter",
    initials: "PE",
    photo: peterPhoto.url,
    audio: peterAudio.url,
    quote: "Stories matter because people matter.",
    tags: [
      { icon: "🎙", label: "Storytelling" },
      { icon: "🎧", label: "Media" },
      { icon: "⭐", label: "Leadership" },
    ],
    story:
      "Peter, creator of the Before the Snap podcast from the Lehigh Valley, brings curiosity and authenticity to audio, conversation, and storytelling. Through JOSHWAY, he's learning that leadership means amplifying voices and creating space for stories that matter.",
  },
];

const StudentCard = ({
  student,
  index,
  playingId,
  setPlayingId,
}: {
  student: Student;
  index: number;
  playingId: string | null;
  setPlayingId: (id: string | null) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [imageOk, setImageOk] = useState(true);
  const isPlaying = playingId === student.name;
  const isDimmed = playingId !== null && !isPlaying;

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) a.play().catch(() => setPlayingId(null));
    else {
      a.pause();
      if (!isPlaying) setProgress((p) => (p === 0 ? 0 : p));
    }
  }, [isPlaying, setPlayingId]);

  const toggle = () => setPlayingId(isPlaying ? null : student.name);

  const onTime = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress((a.currentTime / a.duration) * 100);
  };

  const onKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <motion.article
      // Entrance only — staggered. No audio-state coupling here.
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.1,
        duration: DURATIONS.screen,
        ease: EASE_NARRATIVE,
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-border/40 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]"
    >
      {/* Audio-state dim layer — independent from entrance, no delay */}
      <motion.div
        initial={false}
        animate={{
          opacity: isDimmed ? 0.5 : 1,
        }}
        transition={{ duration: DURATIONS.content, ease: EASE_NARRATIVE }}
        className={`flex h-full flex-col transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isPlaying ? "ring-1 ring-primary/40 rounded-3xl" : ""
        }`}
      >
        {/* Photo */}
        <div className="w-full px-5 pt-5">
          <div className="relative mx-auto aspect-square w-[55%] overflow-hidden rounded-full bg-muted">
            {imageOk ? (
              <img
                src={student.photo}
                alt={`Portrait of ${student.name}`}
                loading="lazy"
                onError={() => setImageOk(false)}
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/10 to-accent/20">
                <span className="font-display text-5xl font-semibold tracking-tight text-primary/70">
                  {student.initials}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-5 px-6 py-6">
          {/* Quote */}
          <blockquote className="font-display text-[17px] font-medium leading-snug tracking-tight text-foreground">
            "{student.quote}"
          </blockquote>

          {/* Audio CTA */}
          <button
            onClick={toggle}
            onKeyDown={onKey}
            aria-label={isPlaying ? `Pause ${student.name}'s story` : `Hear from ${student.name}`}
            aria-pressed={isPlaying}
            className={`group/audio flex items-center gap-3 rounded-full border px-4 py-3 text-left transition-[border-color,background-color] duration-300 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isPlaying
                ? "border-primary/50 bg-primary/5"
                : "border-border bg-background hover:border-primary/40 hover:bg-primary/[0.03]"
            }`}
          >
            <span
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                isPlaying ? "bg-primary text-primary-foreground" : "bg-foreground text-background"
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {isPlaying ? "Now Playing" : "Audio Story"}
              </span>
              <span className="text-[14px] font-semibold text-foreground">
                Hear From {student.name}
              </span>
            </span>
          </button>

          {/* Progress bar — always mounted to reserve space. Outer fades, inner advances width. */}
          <div
            className="h-1 w-full overflow-hidden rounded-full bg-muted transition-opacity duration-200"
            style={{ opacity: isPlaying ? 1 : 0 }}
            aria-hidden
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150"
              style={{ width: `${isPlaying ? progress : 0}%` }}
            />
          </div>

          {/* Story */}
          <p className="text-[14.5px] leading-relaxed text-muted-foreground">
            {student.story}
          </p>

          {/* Tags */}
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {student.tags.map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-[12px] font-medium text-muted-foreground"
              >
                <span aria-hidden>{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <audio
        ref={audioRef}
        src={student.audio}
        onTimeUpdate={onTime}
        onEnded={() => {
          setPlayingId(null);
          setProgress(0);
        }}
        preload="none"
      />
    </motion.article>
  );
};

const ScreenStudentVoices = ({ onNext, onBack }: Props) => {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="min-h-dvh bg-background px-6 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-primary"
          >
            Student Voices
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
          >
            Real Students.<br className="hidden sm:block" /> Real Stories. Real Impact.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Behind every workshop, every bridge crossed, and every leadership lesson is a young
            person discovering who they can become.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-[13px] font-medium text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            300+ Youth Impacted
            <span className="text-muted-foreground/40">•</span>
            Thousands of Futures Ahead
          </motion.div>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
          {students.map((s, i) => (
            <StudentCard
              key={s.name}
              student={s}
              index={i}
              playingId={playingId}
              setPlayingId={setPlayingId}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 flex flex-col items-center gap-3"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="rounded-full px-10 py-6 text-base font-medium transition-[filter,background-color] hover:brightness-95"
          >
            Continue
          </Button>
          <button
            onClick={onBack}
            className="inline-flex min-h-[44px] items-center px-2 text-[13px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            ← Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ScreenStudentVoices;
