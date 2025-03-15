
import React, { useState, useEffect, useRef } from 'react';
import { AnimatedCard } from '../common/AnimatedCard';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee,
  Settings as SettingsIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Timer modes
type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

// Default timer settings (in minutes)
const DEFAULT_SETTINGS = {
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export function PomodoroTimer() {
  // Timer state
  const [settings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focus * 60);
  const [isActive, setIsActive] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  // Refs
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  
  // Sound effects
  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const getProgress = (): number => {
    const totalSeconds = getCurrentModeTotalSeconds();
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  // Get total seconds for current mode
  const getCurrentModeTotalSeconds = (): number => {
    switch (mode) {
      case 'focus': return settings.focus * 60;
      case 'shortBreak': return settings.shortBreak * 60;
      case 'longBreak': return settings.longBreak * 60;
      default: return settings.focus * 60;
    }
  };
  
  // Start the timer
  const startTimer = () => {
    if (isActive) return;
    
    setIsActive(true);
    const now = Date.now();
    startTimeRef.current = now - (pausedTimeRef.current * 1000);
    
    timerRef.current = window.setInterval(() => {
      const secondsElapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      const newTimeLeft = Math.max(0, getCurrentModeTotalSeconds() - secondsElapsed);
      
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft === 0) {
        handleTimerComplete();
      }
    }, 200); // Update more frequently for smoother progress
  };
  
  // Pause the timer
  const pauseTimer = () => {
    if (!isActive) return;
    
    setIsActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    pausedTimeRef.current = (getCurrentModeTotalSeconds() - timeLeft);
  };
  
  // Reset the timer
  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
    setTimeLeft(getCurrentModeTotalSeconds());
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsActive(false);
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    
    // Play sound
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Update state based on current mode
    if (mode === 'focus') {
      const newPomodorosCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodorosCompleted);
      
      // Determine break type
      if (newPomodorosCompleted % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
      
      // Auto-start breaks if enabled
      if (settings.autoStartBreaks) {
        setTimeout(() => startTimer(), 500);
      }
    } else {
      // Break is over, go back to focus mode
      setMode('focus');
      setTimeLeft(settings.focus * 60);
      
      // Auto-start pomodoros if enabled
      if (settings.autoStartPomodoros) {
        setTimeout(() => startTimer(), 500);
      }
    }
  };
  
  // Switch timer mode
  const switchMode = (newMode: TimerMode) => {
    if (mode === newMode) return;
    
    setMode(newMode);
    setTimeLeft(newMode === 'focus' 
      ? settings.focus * 60 
      : newMode === 'shortBreak' 
        ? settings.shortBreak * 60 
        : settings.longBreak * 60
    );
    
    pausedTimeRef.current = 0;
    startTimeRef.current = null;
    setIsActive(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Effect to initialize audio
  useEffect(() => {
    alarmSoundRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    alarmSoundRef.current.preload = 'auto';
    
    return () => {
      if (alarmSoundRef.current) {
        alarmSoundRef.current.pause();
        alarmSoundRef.current = null;
      }
    };
  }, []);
  
  // Get title based on current mode
  const getModeTitle = (): string => {
    switch (mode) {
      case 'focus': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Pomodoro Timer';
    }
  };
  
  // Get color based on current mode
  const getModeColor = (): string => {
    switch (mode) {
      case 'focus': return 'from-blue-500 to-indigo-600';
      case 'shortBreak': return 'from-green-500 to-emerald-600';
      case 'longBreak': return 'from-purple-500 to-violet-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };
  
  return (
    <div className="max-w-xl mx-auto space-y-8 py-4">
      {/* Timer tabs */}
      <div className="flex justify-center">
        <GlassPanel 
          className="p-1 flex rounded-full shadow-sm"
          intensity="high"
        >
          {[
            { key: 'focus', label: 'Focus' },
            { key: 'shortBreak', label: 'Short Break' },
            { key: 'longBreak', label: 'Long Break' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => switchMode(item.key as TimerMode)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full transition-all',
                mode === item.key 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              {item.label}
            </button>
          ))}
        </GlassPanel>
      </div>
      
      {/* Timer display */}
      <AnimatedCard 
        animation="fade" 
        className="p-8 flex flex-col items-center"
        intensity="high"
      >
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold mb-2">{getModeTitle()}</h2>
          <p className="text-sm text-muted-foreground">
            {mode === 'focus' 
              ? `Pomodoro #${pomodorosCompleted + 1}` 
              : 'Take a moment to relax'
            }
          </p>
        </div>
        
        <div className="relative mb-8">
          <div className="w-64 h-64 rounded-full flex items-center justify-center">
            {/* Progress ring */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="5"
              />
              
              {/* Progress ring */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={`url(#${mode}-gradient)`}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                transform="rotate(-90 50 50)"
              />
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="focus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="shortBreak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="longBreak-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer text */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl font-bold tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-muted-foreground mt-1">
                {isActive ? 'Running' : timeLeft === getCurrentModeTotalSeconds() ? 'Ready' : 'Paused'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full glass border border-white/30 text-gray-700 hover:text-gray-900 transition-smooth"
            aria-label="Reset timer"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={isActive ? pauseTimer : startTimer}
            className={cn(
              "p-4 rounded-full bg-gradient-to", 
              getModeColor(),
              "text-white shadow-lg hover:shadow-xl transition-smooth"
            )}
            aria-label={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={() => {}}
            className="p-3 rounded-full glass border border-white/30 text-gray-700 hover:text-gray-900 transition-smooth"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </AnimatedCard>
      
      {/* Stats and info */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatedCard 
          animation="slide-up" 
          delay={100} 
          className="p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Pomodoros</span>
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold">{pomodorosCompleted}</span>
            <div className="text-xs text-muted-foreground mt-1">
              completed today
            </div>
          </div>
        </AnimatedCard>
        
        <AnimatedCard 
          animation="slide-up" 
          delay={200} 
          className="p-4 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Focus Time</span>
          </div>
          <div className="mt-auto">
            <span className="text-2xl font-bold">{(pomodorosCompleted * settings.focus / 60).toFixed(1)}h</span>
            <div className="text-xs text-muted-foreground mt-1">
              total today
            </div>
          </div>
        </AnimatedCard>
      </div>
      
      {/* Tips */}
      <AnimatedCard 
        animation="slide-up" 
        delay={300} 
        className="p-5 flex items-center space-x-4"
      >
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
          <Coffee size={20} className="text-amber-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium">Pomodoro Technique Tip</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Take regular breaks to maintain productivity. Research shows that brief mental rest improves focus and prevents burnout.
          </p>
        </div>
      </AnimatedCard>
    </div>
  );
}
