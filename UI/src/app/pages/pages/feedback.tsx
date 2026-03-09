import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';

export function FeedbackPage() {
  const navigate = useNavigate();
  const [fairness, setFairness] = useState<'fair' | 'unfair'>('fair');
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    console.log('Feedback submitted:', { fairness, feedback });
    setSubmitted(true);
    setTimeout(() => {
      navigate('/live-shift');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="border border-[#7ba88a]/30 rounded-md p-8 bg-white max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-[#7ba88a]/20 border-2 border-[#7ba88a] flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-[#7ba88a]" />
          </div>
          <h2 className="text-lg mb-2">Feedback Submitted</h2>
          <p className="text-sm text-muted-foreground">
            Thank you for your feedback. We value your input.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="flex items-center px-8 h-16">
          <button 
            onClick={() => navigate('/live-shift')}
            className="text-muted-foreground hover:text-foreground transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg">Report Issue</h1>
            <p className="text-xs text-muted-foreground">
              Provide feedback on flagged events
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-8 py-8">
        <div className="border border-border rounded-md p-6 bg-white">
          <div className="mb-6">
            <h2 className="text-base mb-2">Event Review</h2>
            <p className="text-sm text-muted-foreground">
              Recent events have been flagged during your shift. Please review the assessment and provide your perspective.
            </p>
          </div>

          {/* Flagged Events Summary */}
          <div className="border border-border rounded p-4 bg-muted/30 mb-6">
            <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              Flagged Events from Current Shift
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">Harsh Braking</span>
                <span className="text-xs text-muted-foreground">14:32:18</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">Sustained Cabin Audio</span>
                <span className="text-xs text-muted-foreground">14:31:45</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm">Sudden Maneuver</span>
                <span className="text-xs text-muted-foreground">14:30:12</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm">Overlap Detected</span>
                <span className="text-xs text-muted-foreground">14:28:03</span>
              </div>
            </div>
          </div>

          {/* Fairness Assessment */}
          <div className="mb-6">
            <Label className="text-sm mb-3 block">
              Do you believe these flagged events accurately represent the situations?
            </Label>
            <RadioGroup value={fairness} onValueChange={(value) => setFairness(value as 'fair' | 'unfair')}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 border border-border rounded p-4 hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="fair" id="fair" />
                  <Label htmlFor="fair" className="text-sm font-normal cursor-pointer flex-1">
                    <div className="font-medium mb-1">Fair Assessment</div>
                    <div className="text-xs text-muted-foreground">
                      The flagged events accurately reflect what happened during my shift
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border border-border rounded p-4 hover:bg-muted/30 transition-colors">
                  <RadioGroupItem value="unfair" id="unfair" />
                  <Label htmlFor="unfair" className="text-sm font-normal cursor-pointer flex-1">
                    <div className="font-medium mb-1">Unfair Assessment</div>
                    <div className="text-xs text-muted-foreground">
                      The flagged events do not accurately represent the actual situations
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Feedback Text */}
          <div className="mb-6">
            <Label htmlFor="feedback-text" className="text-sm mb-2 block">
              Additional Context (Optional)
            </Label>
            <Textarea
              id="feedback-text"
              placeholder="Please provide any additional context about these events. What were the actual circumstances? Was there traffic, road conditions, or passenger behavior that contributed?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your feedback helps improve our detection system and provides important context for review.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              className="bg-foreground text-white hover:bg-foreground/90 transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/live-shift')}
              className="border-border hover:bg-muted transition-colors"
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
