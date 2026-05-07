import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Heart, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, navigate] = useLocation();

  const requestResetMutation = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Password reset link sent to your email");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send reset link");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    await requestResetMutation.mutateAsync({ email });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">LightPath</h1>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        {!isSubmitted ? (
          <>
            <p className="text-sm text-muted-foreground mb-6 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  disabled={requestResetMutation.isPending}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={requestResetMutation.isPending}
              >
                {requestResetMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Check your email!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              The link will expire in 24 hours. If you don't see the email, check your spam folder.
            </p>

            <Button
              variant="outline"
              onClick={() => {
                setEmail("");
                setIsSubmitted(false);
              }}
              className="w-full"
            >
              Send another link
            </Button>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 pt-6 border-t border-border text-center">
          <a
            href="/login"
            className="text-primary hover:underline inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </a>
        </div>
      </Card>
    </div>
  );
}
