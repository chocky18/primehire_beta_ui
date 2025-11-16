import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificateData from "./pages/CertificateData";
import WebcamRecorder from "./InterviewBot/WebcamRecorder";
import InstructionsPrompt from "./InterviewBot/InstructionsPrompt"
import ValidationPanel from "./InterviewBot/ValidationPanel";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/webcam-recorder" element={<WebcamRecorder />} />
          <Route path="/certificatedata" element={<CertificateData />} />
          <Route path="/instructions" element={<InstructionsPrompt />} /> {/* ✅ Add this route */}
          <Route path="/validation_panel" element={<ValidationPanel />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App; 