
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { GlassPanel } from '@/components/common/GlassPanel';
import { 
  User, 
  Bell, 
  Clock, 
  Palette, 
  ShieldCheck, 
  HelpCircle,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  BookOpen,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const isMobile = useIsMobile();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  
  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-1">
          <div className="inline-flex items-center space-x-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              Settings
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Your Preferences</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account & Sync */}
          <AnimatedCard
            animation="fade" 
            delay={100}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3">
              <User className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Account & Sync</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Google Account</h4>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Google Drive Sync</h4>
                  <p className="text-xs text-muted-foreground">Auto-sync data to Drive</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </AnimatedCard>
          
          {/* Notifications */}
          <AnimatedCard
            animation="fade" 
            delay={200}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3">
              <Bell className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Task Reminders</h4>
                  <p className="text-xs text-muted-foreground">Get notified about upcoming tasks</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Study Session Alerts</h4>
                  <p className="text-xs text-muted-foreground">Reminders for scheduled study time</p>
                </div>
                <Switch checked={notifications} />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Sound</h4>
                  <p className="text-xs text-muted-foreground">Enable notification sounds</p>
                </div>
                {notifications ? (
                  <Volume2 className="text-muted-foreground" size={20} />
                ) : (
                  <VolumeX className="text-muted-foreground" size={20} />
                )}
              </div>
            </div>
          </AnimatedCard>
          
          {/* Timer & Pomodoro */}
          <AnimatedCard
            animation="fade" 
            delay={300}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3">
              <Clock className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Timer & Pomodoro</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Custom Pomodoro</h4>
                  <p className="text-xs text-muted-foreground">Customize study/break intervals</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Auto Start Breaks</h4>
                  <p className="text-xs text-muted-foreground">Automatically start break timer</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </AnimatedCard>
          
          {/* Personalization */}
          <AnimatedCard
            animation="fade" 
            delay={400}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3">
              <Palette className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Personalization</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun size={16} className={!darkMode ? "text-primary" : "text-muted-foreground"} />
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  <Moon size={16} className={darkMode ? "text-primary" : "text-muted-foreground"} />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Font Size</h4>
                  <p className="text-xs text-muted-foreground">Adjust text size</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs">A</span>
                  <input type="range" min="1" max="3" defaultValue="2" className="w-20" />
                  <span className="text-base">A</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
          
          {/* Study Parameters */}
          <AnimatedCard
            animation="fade" 
            delay={500}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Assessment Parameters</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Courses & Subjects</h4>
                  <p className="text-xs text-muted-foreground">Manage your course load and subjects</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Study Preferences</h4>
                  <p className="text-xs text-muted-foreground">Update your strengths, weaknesses, and study habits</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </AnimatedCard>
          
          {/* Security & Privacy */}
          <AnimatedCard
            animation="fade" 
            delay={600}
            className="p-5 flex flex-col space-y-4"
          >
            <div className="flex items-center space-x-3">
              <Lock className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Security & Privacy</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Data Backup</h4>
                  <p className="text-xs text-muted-foreground">Configure backup frequency</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-black/5 transition-smooth">
                <div>
                  <h4 className="text-sm font-medium">Privacy Policy</h4>
                  <p className="text-xs text-muted-foreground">View our privacy terms</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
