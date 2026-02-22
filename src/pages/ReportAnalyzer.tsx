import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, FileText, AlertCircle, CheckCircle, Activity, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import GlassNavbar from "@/components/GlassNavbar";
import ClickSpark from "@/components/ClickSpark";
import jsPDF from "jspdf";

const ReportAnalyzer = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setSelectedImage(imageData);
      setAnalysis(null);
    } catch (error) {
      console.error('Camera error:', error);
      toast.error("Unable to access camera");
    }
  };

  const analyzeReport = async () => {
    if (!selectedImage) {
      toast.error("Please select or capture an image first");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      console.log('Starting analysis...');
      const { data, error } = await supabase.functions.invoke('analyze-report', {
        body: { imageData: selectedImage }
      });

      console.log('Analysis response:', { data, error });

      if (error) {
        console.error('Analysis error:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (!data?.analysis) {
        throw new Error('No analysis data received');
      }

      console.log('Analysis received:', data.analysis);
      setAnalysis(data.analysis);
      toast.success("Report analyzed successfully!");
    } catch (error: any) {
      console.error('Error analyzing report:', error);
      toast.error(error.message || "Failed to analyze report");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadAsPDF = () => {
    if (!analysis) return;
    
    try {
      const doc = new jsPDF();
      const sections = parseAnalysis(analysis);
      let y = 20;
      const lineHeight = 7;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;

      // Title
      doc.setFontSize(16);
      doc.setTextColor(0, 128, 128);
      doc.text("Medical Report Analysis", margin, y);
      y += lineHeight * 2;

      // Helper function to add text with word wrapping
      const addSection = (title: string, content: string) => {
        if (!content) return;
        
        doc.setFontSize(12);
        doc.setTextColor(0, 128, 128);
        doc.text(title, margin, y);
        y += lineHeight;
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const lines = doc.splitTextToSize(content, doc.internal.pageSize.width - margin * 2);
        
        lines.forEach((line: string) => {
          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });
        
        y += lineHeight;
      };

      const hasAny = Boolean(sections.summary || sections.parameters || sections.issues || sections.risks || sections.recommendations);

      if (!hasAny) {
        addSection("Full Analysis", analysis);
      } else {
        addSection("Summary", sections.summary);
        addSection("Key Health Parameters", sections.parameters);
        addSection("Detected Issues", sections.issues);
        addSection("Health Risks", sections.risks);
        addSection("Recommendations", sections.recommendations);
      }

      // Add disclaimer
      if (y > pageHeight - margin * 3) {
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      const disclaimer = "This AI-powered analysis is for informational purposes only. Always consult healthcare professionals for medical advice.";
      const disclaimerLines = doc.splitTextToSize(disclaimer, doc.internal.pageSize.width - margin * 2);
      doc.text(disclaimerLines, margin, y);

      doc.save("medical-report-analysis.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF");
    }
  };

  const downloadAsText = () => {
    if (!analysis) return;
    
    try {
      const sections = parseAnalysis(analysis);
      let textContent = "MEDICAL REPORT ANALYSIS\n";
      textContent += "=".repeat(50) + "\n\n";
      
      const hasAny = Boolean(sections.summary || sections.parameters || sections.issues || sections.risks || sections.recommendations);

      if (!hasAny) {
        textContent += "FULL ANALYSIS\n" + "-".repeat(50) + "\n";
        textContent += analysis + "\n\n";
      } else {
        if (sections.summary) {
          textContent += "SUMMARY\n" + "-".repeat(50) + "\n";
          textContent += sections.summary + "\n\n";
        }
        if (sections.parameters) {
          textContent += "KEY HEALTH PARAMETERS\n" + "-".repeat(50) + "\n";
          textContent += sections.parameters + "\n\n";
        }
        if (sections.issues) {
          textContent += "DETECTED ISSUES\n" + "-".repeat(50) + "\n";
          textContent += sections.issues + "\n\n";
        }
        if (sections.risks) {
          textContent += "HEALTH RISKS\n" + "-".repeat(50) + "\n";
          textContent += sections.risks + "\n\n";
        }
        if (sections.recommendations) {
          textContent += "RECOMMENDATIONS\n" + "-".repeat(50) + "\n";
          textContent += sections.recommendations + "\n\n";
        }
      }

      
      textContent += "=".repeat(50) + "\n";
      textContent += "DISCLAIMER: This AI-powered analysis is for informational purposes only.\n";
      textContent += "Always consult healthcare professionals for medical advice.\n";

      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'medical-report-analysis.txt';
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success("Text file downloaded successfully!");
    } catch (error) {
      console.error('Text download error:', error);
      toast.error("Failed to download text file");
    }
  };

  const parseAnalysis = (text: string) => {
    const sections = {
      summary: '',
      parameters: '',
      issues: '',
      risks: '',
      recommendations: ''
    };

    if (!text) return sections;

    // Normalize line endings
    const normalized = text.replace(/\r\n?/g, '\n');

    // Detect markdown-style headings like:
    // - **Summary**
    // - ### 1. Summary
    // - 1. Summary
    // - Summary
    const headingRegex = /^(?:#+\s*|###\s*\d*\.?\s*|\d+\.\s*)?\s*(Summary|Key Health Parameters|Detected Issues|Health Risks|Recommendations)\s*(?:\*\*)?\s*:?\s*$/gim;

    const matches: { key: keyof typeof sections; index: number; end: number }[] = [];
    const keyMap: Record<string, keyof typeof sections> = {
      'Summary': 'summary',
      'Key Health Parameters': 'parameters',
      'Detected Issues': 'issues',
      'Health Risks': 'risks',
      'Recommendations': 'recommendations',
    };

    for (const m of normalized.matchAll(headingRegex)) {
      if (m.index == null) continue;
      const raw = (m[1] || '').trim();
      const key = keyMap[raw as keyof typeof keyMap];
      if (key) {
        matches.push({ key, index: m.index + m[0].length, end: m.index + m[0].length });
      }
    }

    // If we didn't find headings, try legacy bold markers like **Summary**:
    if (matches.length === 0) {
      const legacy = [
        { key: 'summary', re: /\*\*Summary\*\*:?(.*?)(?=\*\*(?:Key Health Parameters|Detected Issues|Health Risks|Recommendations)\*\*|$)/is },
        { key: 'parameters', re: /\*\*Key Health Parameters\*\*:?(.*?)(?=\*\*(?:Detected Issues|Health Risks|Recommendations)\*\*|$)/is },
        { key: 'issues', re: /\*\*Detected Issues\*\*:?(.*?)(?=\*\*(?:Health Risks|Recommendations)\*\*|$)/is },
        { key: 'risks', re: /\*\*Health Risks\*\*:?(.*?)(?=\*\*Recommendations\*\*|$)/is },
        { key: 'recommendations', re: /\*\*Recommendations\*\*:?(.*)$/is },
      ] as const;

      for (const { key, re } of legacy) {
        const m = normalized.match(re);
        if (m && m[1]) (sections as any)[key] = m[1].trim();
      }
      return sections;
    }

    // Sort matches by position and extract content between them
    matches.sort((a, b) => a.index - b.index);
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];
      const slice = normalized.slice(current.index, next ? next.index - (next.index - next.end) : undefined).trim();
      sections[current.key] = slice;
    }

    return sections;
  };

  const sections = analysis ? parseAnalysis(analysis) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <GlassNavbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <ClickSpark>
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </ClickSpark>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Medical Report Analyzer
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload or capture your medical report for instant AI-powered analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Upload Report
              </h2>
              
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <ClickSpark>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    variant="outline"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </ClickSpark>

                <ClickSpark>
                  <Button
                    onClick={handleCameraCapture}
                    className="w-full"
                    variant="outline"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photo
                  </Button>
                </ClickSpark>

                {selectedImage && (
                  <div className="mt-4">
                    <img
                      src={selectedImage}
                      alt="Selected report"
                      className="w-full rounded-lg border border-primary/20"
                    />
                    <ClickSpark>
                      <Button
                        onClick={analyzeReport}
                        disabled={isAnalyzing}
                        className="w-full mt-4"
                      >
                        {isAnalyzing ? (
                          <>
                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Activity className="w-4 h-4 mr-2" />
                            Analyze Report
                          </>
                        )}
                      </Button>
                    </ClickSpark>
                  </div>
                )}
              </div>
            </Card>

            <Card className="glass-panel p-6">
              <h2 className="text-xl font-semibold mb-4">Guidelines</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Ensure the report is clearly visible and well-lit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Supported formats: JPG, PNG, WEBP (max 20MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Works with blood tests, MRI, ultrasound, and lab reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>AI analysis is for informational purposes only</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>Always consult a healthcare professional for medical advice</span>
                </li>
              </ul>
            </Card>
          </div>

          {analysis && sections && (
            <Card className="glass-panel p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-primary" />
                  Analysis Results
                </h2>
                <div className="flex gap-2">
                  <ClickSpark>
                    <Button onClick={downloadAsText} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download TXT
                    </Button>
                  </ClickSpark>
                  <ClickSpark>
                    <Button onClick={downloadAsPDF} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </ClickSpark>
                </div>
              </div>

              <div className="space-y-6">
                {sections.summary && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Summary</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{sections.summary}</p>
                  </div>
                )}

                {sections.parameters && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Key Health Parameters</h3>
                    <div className="text-muted-foreground whitespace-pre-line">{sections.parameters}</div>
                  </div>
                )}

                {sections.issues && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-600 dark:text-yellow-500 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Detected Issues
                    </h3>
                    <div className="text-muted-foreground whitespace-pre-line">{sections.issues}</div>
                  </div>
                )}

                {sections.risks && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Health Risks</h3>
                    <div className="text-muted-foreground whitespace-pre-line">{sections.risks}</div>
                  </div>
                )}

                {sections.recommendations && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2 text-primary flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Recommendations
                    </h3>
                    <div className="text-muted-foreground whitespace-pre-line">{sections.recommendations}</div>
                  </div>
                )}

                {!sections.summary && !sections.parameters && !sections.issues && !sections.risks && !sections.recommendations && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-primary">Full Analysis</h3>
                    <div className="text-muted-foreground whitespace-pre-wrap">{analysis}</div>
                  </div>
                )}
              </div>


              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                  <span>
                    This AI-powered analysis is for informational purposes only and should not replace professional medical advice. 
                    Always consult with qualified healthcare professionals for diagnosis and treatment.
                  </span>
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalyzer;
