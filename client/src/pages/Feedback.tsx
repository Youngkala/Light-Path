import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Send, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

type FeedbackType = "review" | "complaint" | "suggestion" | "bug_report";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState<FeedbackType>("review");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackMutation = trpc.feedback.submit.useMutation();

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await feedbackMutation.mutateAsync({
        name: name.trim(),
        email: email.trim() || undefined,
        feedbackType,
        rating: feedbackType === "complaint" ? undefined : rating,
        message: message.trim(),
      });

      // Show success message with email confirmation
      const emailMessage = email.trim() 
        ? "Thank you for helping improve LightPath! We've sent a confirmation to your email." 
        : "Thank you for helping improve LightPath! Your feedback has been received.";
      
      toast.success(emailMessage + " 🙏");
      setName("");
      setEmail("");
      setFeedbackType("review");
      setRating(5);
      setMessage("");
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, feedbackType, rating, message, feedbackMutation]);

  const feedbackTypes = [
    { value: "review" as FeedbackType, label: "Review", icon: "⭐" },
    { value: "complaint" as FeedbackType, label: "Complaint", icon: "⚠️" },
    { value: "suggestion" as FeedbackType, label: "Suggestion", icon: "💡" },
    { value: "bug_report" as FeedbackType, label: "Bug Report", icon: "🐛" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Feedback & Reviews</h1>
          <p className="text-sm text-primary-foreground/80">
            Help us improve LightPath with your feedback
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="space-y-6">
          {/* Introduction Card */}
          <Card className="bg-card border-border p-6 rounded-2xl">
            <p className="text-foreground text-center">
              Your feedback is valuable to us. Whether it's a suggestion, bug report, or review, 
              we'd love to hear from you. Help us make LightPath better for everyone.
            </p>
          </Card>

          {/* Form */}
          <Card className="bg-card border-border p-6 rounded-2xl space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50"
              />
            </div>

            {/* Feedback Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Feedback Type *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setFeedbackType(type.value)}
                    disabled={isSubmitting}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      feedbackType === type.value
                        ? "border-accent bg-accent/10"
                        : "border-border bg-background hover:border-accent/50"
                    } disabled:opacity-50`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-sm font-medium text-foreground">
                      {type.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating (Only for non-complaint feedback) */}
            {feedbackType !== "complaint" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      disabled={isSubmitting}
                      className="transition-all disabled:opacity-50"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? "fill-accent text-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Field */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please share your feedback in detail..."
                disabled={isSubmitting}
                rows={6}
                className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all disabled:opacity-50 resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {message.length} characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg p-3 h-auto transition-all font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </Card>

          {/* Tips Card */}
          <Card className="bg-card border-border p-6 rounded-2xl">
            <h3 className="font-semibold text-foreground mb-3">💡 Tips for Better Feedback</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Be specific and detailed in your feedback</li>
              <li>• Include steps to reproduce bugs if applicable</li>
              <li>• Share what you liked or what could be improved</li>
              <li>• Your email helps us follow up with you</li>
            </ul>
          </Card>

          {/* Email Notification Info */}
          <Card className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
            <h3 className="font-semibold text-foreground mb-2">📧 Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              All feedback is sent to our support team at <span className="font-mono text-accent">lightpath2109@gmail.com</span>. 
              If you provide your email, we may reach out to discuss your feedback further.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
