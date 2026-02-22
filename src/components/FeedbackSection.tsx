import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ClickSpark from "./ClickSpark";
import ScrollFloat from "./ScrollFloat";

const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please write your feedback before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      });
      setRating(0);
      setFeedback("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <ScrollFloat
            containerClassName="mb-4"
            textClassName="text-white !text-4xl md:!text-5xl !font-bold"
          >
            We Value Your Feedback
          </ScrollFloat>
          <p className="text-white/70 text-lg">
            Help us improve by sharing your experience
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center space-y-3">
              <label className="text-white font-semibold text-lg block">
                Rate Your Experience
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <ClickSpark
                    key={star}
                    sparkColor="#FFD700"
                    sparkSize={10}
                    sparkRadius={18}
                    sparkCount={8}
                    duration={400}
                  >
                    <button
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={`transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    </button>
                  </ClickSpark>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-green-400 text-sm">
                  {rating === 5 && "Excellent! ⭐"}
                  {rating === 4 && "Great! 👍"}
                  {rating === 3 && "Good 😊"}
                  {rating === 2 && "Fair 🤔"}
                  {rating === 1 && "Needs Improvement 💭"}
                </p>
              )}
            </div>

            {/* Feedback Text */}
            <div className="space-y-3">
              <label className="text-white font-semibold text-lg block">
                Tell Us More
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or any issues you faced..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none"
                maxLength={500}
              />
              <p className="text-white/50 text-sm text-right">
                {feedback.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={12}
              sparkRadius={22}
              sparkCount={10}
              duration={600}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 text-lg font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send size={20} />
                    Submit Feedback
                  </div>
                )}
              </Button>
            </ClickSpark>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
