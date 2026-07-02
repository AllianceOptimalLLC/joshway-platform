import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const DEFAULTS = {
  founder_photo_url: "",
  elevation_message:
    "Carry the mission well.\n\n— David",
};

const ScreenFounderClosing = ({ onNext, onBack }: Props) => {
  const [content, setContent] = useState<{ founder_photo_url: string; elevation_message: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("academy_content")
        .select("content_json")
        .eq("section_name", "founder_presence")
        .eq("is_published", true)
        .maybeSingle();
      if (error) {
        console.error("ScreenFounderClosing fetch error:", error);
      }
      if (data?.content_json) {
        const json = data.content_json as Record<string, any>;
        setContent({
          founder_photo_url: json.founder_photo_url || "",
          elevation_message:
            json.elevation_message ||
            json.closing_message ||
            DEFAULTS.elevation_message,
        });
      } else {
        setContent(DEFAULTS);
      }
    };
    load();
  }, []);

  const renderLine = (line: string, idx: number) => {
    const isSignature = line.startsWith("—");
    const isHeading = line.startsWith("Before You Go") || line.startsWith("Here's my ask");

    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
    );

    if (isHeading) {
      return (
        <motion.h3
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
          className="mt-6 mb-2 text-base font-semibold text-foreground"
        >
          {rendered}
        </motion.h3>
      );
    }

    return (
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + idx * 0.08, duration: 0.4 }}
        className={`text-sm leading-relaxed ${
          isSignature ? "mt-4 text-xs text-muted-foreground italic" : "text-muted-foreground"
        }`}
      >
        {rendered}
      </motion.p>
    );
  };

  if (!content) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-6 sm:px-8 py-24">
        <div className="animate-pulse text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const lines = content.elevation_message.split("\n").filter((l) => l.trim());

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 sm:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto w-full max-w-md text-center space-y-12"
      >
        {content.founder_photo_url && (
          <motion.img
            src={content.founder_photo_url}
            alt="Founder"
            className="mx-auto h-28 w-28 rounded-full object-cover object-top shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        )}

        <div className="space-y-2">
          {lines.map((line, i) => renderLine(line, i))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col items-center gap-3 pt-6"
        >
          <Button
            onClick={onNext}
            className="w-full rounded-full text-base py-6 font-medium hover:brightness-95 transition-[filter,background-color]"
            size="lg"
          >
            Continue
          </Button>
          <button
            onClick={onBack}
            className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors min-h-[44px] px-2 inline-flex items-center"
          >
            ← Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScreenFounderClosing;
