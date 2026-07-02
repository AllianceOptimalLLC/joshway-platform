import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Plus, X, Send, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { logEvent } from "@/lib/academy/eventLogger";

interface InviteEntry {
  first_name: string;
  email: string;
}

const EMPTY_ENTRY: InviteEntry = { first_name: "", email: "" };

interface Props {
  onNext: (extra?: Record<string, any>) => void | Promise<void>;
  onBack: () => void;
  connectFormConfirmed: boolean;
  onConfirmInvite: () => void;
}

const ScreenCommitmentInvite = ({ onNext, onBack, connectFormConfirmed, onConfirmInvite }: Props) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [inviteEntries, setInviteEntries] = useState<InviteEntry[]>([{ ...EMPTY_ENTRY }]);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(connectFormConfirmed ? 1 : 0);

  const updateEntry = (index: number, field: keyof InviteEntry, value: string) => {
    setInviteEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addEntry = () => {
    if (inviteEntries.length >= 10) return;
    setInviteEntries((prev) => [...prev, { ...EMPTY_ENTRY }]);
  };

  const removeEntry = (index: number) => {
    if (inviteEntries.length <= 1) return;
    setInviteEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const validEntries = inviteEntries.filter(
    (e) => e.first_name.trim() && e.email.trim() && e.email.includes("@")
  );

  const sendInvites = async () => {
    if (validEntries.length === 0 || !user) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("academy-invite", {
        body: {
          invitations: validEntries.map((e) => ({
            first_name: e.first_name.trim(),
            email: e.email.trim().toLowerCase(),
          })),
          is_commitment_invite: true,
          is_single_invite: validEntries.length === 1,
        },
      });

      if (error) throw error;

      const sent = data?.sent ?? validEntries.length;
      setSentCount(sent);
      onConfirmInvite();
      toast({
        title: sent === 1 ? "Invitation sent!" : `${sent} invitations sent!`,
        description: "They'll receive an email to begin the Academy.",
      });
      logEvent("commitment_invites_sent", { metadata: { count: sent } });
    } catch (err: any) {
      console.error("Invite error:", err);
      toast({
        title: "Couldn't send invites",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const hasSent = sentCount > 0 || connectFormConfirmed;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 sm:px-6 py-16">
      <div className="mx-auto w-full max-w-[34rem] space-y-10">
        {/* Header */}
        <div className="text-center pt-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Let's invite some friends.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground/70">
            Share the Academy experience with people in your network.
          </p>
        </div>

        {/* Invite form */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
          {hasSent ? (
            <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <Check className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-foreground">
                {sentCount === 1
                  ? "1 invitation sent successfully."
                  : `${sentCount} invitations sent successfully.`}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {inviteEntries.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder="First name"
                      value={entry.first_name}
                      onChange={(e) => updateEntry(i, "first_name", e.target.value)}
                      className="flex-1 rounded-xl text-sm h-9"
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={entry.email}
                      onChange={(e) => updateEntry(i, "email", e.target.value)}
                      className="flex-1 rounded-xl text-sm h-9"
                    />
                    {inviteEntries.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 shrink-0 rounded-full opacity-50 hover:opacity-100"
                        onClick={() => removeEntry(i)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {inviteEntries.length < 10 && (
                <button
                  onClick={addEntry}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another
                </button>
              )}

              <Button
                onClick={sendInvites}
                disabled={validEntries.length === 0 || sending}
                size="sm"
                className="rounded-full"
              >
                {sending ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-3.5 w-3.5" />
                )}
                {sending
                  ? "Sending..."
                  : validEntries.length <= 1
                    ? "Send Invitation"
                    : `Send ${validEntries.length} Invitations`}
              </Button>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button
            onClick={onNext}
            disabled={!hasSent}
            className="w-full rounded-full text-base py-6 transition-opacity duration-200"
            size="lg"
          >
            Next
          </Button>
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full opacity-50 hover:opacity-100">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenCommitmentInvite;
