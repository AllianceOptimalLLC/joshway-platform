import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
}

const DEFAULTS = {
  founder_photo_url: "",
  opening_message:
    "I'm David Robertson.\n\nWe built JOSHWAY because no young person should feel invisible.\n\nWhat you're about to experience matters.\n\nBegin.",
};

const ScreenFounderOpening = ({ onNext }: Props) => {
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
          opening_message: json.opening_message || DEFAULTS.opening_message,
        });
      }
    };
    load();
  }, []);

  const lines = content.opening_message.split("\n").filter((l) => l.trim());

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-jw-gray text-foreground px-6 sm:px-8 py-24">
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
            className="mx-auto h-36 w-36 rounded-full object-cover object-top shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
        )}

        <div className="space-y-4">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
              className={`text-base leading-relaxed ${
                i === 0 ? "text-lg font-medium" : "text-muted-foreground"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="pt-4"
        >
          <Button
            onClick={onNext}
            className="rounded-full px-12 py-6 text-base font-medium hover:brightness-95 transition-[filter,background-color]"
            size="lg"
          >
            Begin
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScreenFounderOpening;
