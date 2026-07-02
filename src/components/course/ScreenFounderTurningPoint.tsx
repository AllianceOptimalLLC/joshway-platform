import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
}

const DEFAULTS = {
  founder_photo_url: "",
  turning_point_message:
    "This mission is deeply personal to me.\n\nBut it's bigger than me.\n\nIt belongs to anyone willing to carry it.\n\n— David",
};

const ScreenFounderTurningPoint = ({ onNext, onBack }: Props) => {
  const [content, setContent] = useState(DEFAULTS);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("academy_content")
        .select("content_json")
        .eq("section_name", "founder_presence")
        .eq("is_published", true)
        .maybeSingle();
      if (data?.content_json) {
        const json = data.content_json as Record<string, any>;
        setContent({
          founder_photo_url: json.founder_photo_url || "",
          turning_point_message: json.turning_point_message || DEFAULTS.turning_point_message,
        });
      }
    };
    load();
  }, []);

  const lines = content.turning_point_message.split("\n").filter((l) => l.trim());

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-jw-gray px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full max-w-md text-center space-y-10"
      >
        {content.founder_photo_url && (
          <motion.img
            src={content.founder_photo_url}
            alt="Founder"
            className="mx-auto h-28 w-28 rounded-full object-cover object-top shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          />
        )}

        <div className="space-y-4">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
              className={`text-base leading-relaxed ${
                line.startsWith("—") ? "text-sm text-muted-foreground italic" : ""
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button onClick={onNext} className="rounded-full px-8" size="lg">
            Continue
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScreenFounderTurningPoint;
