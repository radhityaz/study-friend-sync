
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import { AuthProvider, RequireAuth } from "./hooks/useAuth";

// Add framer-motion for smooth page transitions
import { MotionConfig } from "framer-motion";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Timer = lazy(() => import("./pages/Timer"));
const Notes = lazy(() => import("./pages/Notes"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Settings = lazy(() => import("./pages/Settings"));
const StudySchedule = lazy(() => import("./pages/StudySchedule"));
const Auth = lazy(() => import("./pages/Auth"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner fullScreen size="lg" message="Loading Jadwalinæ..." />}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
                  <Route path="/tasks" element={<RequireAuth><Tasks /></RequireAuth>} />
                  <Route path="/timer" element={<RequireAuth><Timer /></RequireAuth>} />
                  <Route path="/notes" element={<RequireAuth><Notes /></RequireAuth>} />
                  <Route path="/calendar" element={<RequireAuth><Calendar /></RequireAuth>} />
                  <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
                  <Route path="/study-schedule" element={<RequireAuth><StudySchedule /></RequireAuth>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
