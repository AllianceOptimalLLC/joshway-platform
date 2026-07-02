import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const FounderElevation = () => {
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
        console.error("FounderElevation fetch error:", error);
      }
      if (data?.content_json) {
        const json = data.content_json as Record<string, any>;
        setContent({
          founder_photo_url: json.founder_photo_url || "",
          elevation_message: json.elevation_message || "",
        });
      } else {
        setContent({
          founder_photo_url: "",
          elevation_message: "Carry the mission well.\n\n— David",
        });
      }
    };
    load();
  }, []);

  // Parse lines, rendering **bold** markers as <strong>
  const renderLine = (line: string, idx: number) => {
    const isSignature = line.startsWith("—");
    const isHeading = line.startsWith("Before You Go") || line.startsWith("Here's my ask");

    // Convert **text** to <strong>
    const parts = line.split(/\*\*(.*?)\*\*/g);
    const rendered = parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
    );

    if (isHeading) {
      return (
        <h3 key={idx} className="text-base font-semibold text-foreground mt-6 mb-2">
          {rendered}
        </h3>
      );
    }

    return (
      <p
        key={idx}
        className={`text-sm leading-relaxed ${
          isSignature
            ? "text-xs text-muted-foreground italic mt-4"
            : "text-muted-foreground"
        }`}
      >
        {rendered}
      </p>
    );
  };

  if (!content) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  const lines = content.elevation_message.split("\n").filter((l) => l.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="w-full space-y-2"
    >
      <div className="flex flex-col items-center gap-5">
        {content.founder_photo_url && (
          <img
            src={content.founder_photo_url}
            alt="Founder"
            className="h-24 w-24 rounded-full object-cover object-top shadow-sm"
          />
        )}
        <div className="max-w-lg text-center space-y-2">
          {lines.map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </motion.div>
  );
};

export default FounderElevation;
