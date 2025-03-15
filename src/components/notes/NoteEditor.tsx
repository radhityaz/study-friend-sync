
import React, { useState } from 'react';
import { AnimatedCard } from '../common/AnimatedCard';
import { GlassPanel } from '../common/GlassPanel';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Code, 
  Image, 
  Mic,
  Save,
  Share,
  File,
  Search
} from 'lucide-react';

// Mock notes data
const mockNotes = [
  { id: '1', title: 'Physics - Relativity', content: 'Notes on special and general relativity...', date: '2024-05-02', category: 'academic' },
  { id: '2', title: 'Data Structures - Trees', content: 'Binary trees, AVL trees, Red-Black trees...', date: '2024-05-08', category: 'academic' },
  { id: '3', title: 'Project Ideas', content: 'Potential research topics for next semester...', date: '2024-04-25', category: 'project' },
  { id: '4', title: 'Study Schedule', content: 'Weekly planning for finals week...', date: '2024-05-10', category: 'personal' },
];

export function NoteEditor() {
  const [activeNote, setActiveNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleNoteSelect = (id: string) => {
    const selected = mockNotes.find(note => note.id === id);
    if (selected) {
      setActiveNote(id);
      setNoteTitle(selected.title);
      setNoteContent(selected.content);
    }
  };
  
  const handleNewNote = () => {
    setActiveNote('');
    setNoteTitle('New Note');
    setNoteContent('');
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would integrate with the Web Speech API
  };
  
  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Note list sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <AnimatedCard 
          animation="slide-up" 
          className="p-4 flex flex-col h-full"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">My Notes</h2>
            <button 
              onClick={handleNewNote}
              className="p-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-smooth"
            >
              <span className="sr-only">Add new note</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full glass border-0 pl-9 py-2 focus:ring-2 focus:ring-primary/30 rounded-lg"
            />
          </div>
          
          <div className="space-y-2 overflow-y-auto flex-1">
            {mockNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleNoteSelect(note.id)}
                className={`w-full text-left p-3 rounded-lg transition-smooth ${
                  activeNote === note.id 
                    ? 'bg-primary/10 border border-primary/30' 
                    : 'hover:bg-black/5 border border-transparent'
                }`}
              >
                <h3 className="text-sm font-medium truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-muted-foreground">{new Date(note.date).toLocaleDateString()}</span>
                  <span className="inline-block ml-2 px-1.5 py-0.5 bg-black/5 rounded text-xs">
                    {note.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </AnimatedCard>
      </div>
      
      {/* Editor area */}
      <div className="flex-1">
        <AnimatedCard 
          animation="fade" 
          className="p-6 h-full flex flex-col"
        >
          {/* Editor toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1">
              <GlassPanel className="flex items-center space-x-1 p-1 rounded-lg">
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Bold">
                  <Bold size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Italic">
                  <Italic size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Bullet list">
                  <List size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Numbered list">
                  <ListOrdered size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Heading 1">
                  <Heading1 size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Heading 2">
                  <Heading2 size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Code">
                  <Code size={16} />
                </button>
                <button className="p-1.5 rounded hover:bg-black/5 transition-smooth" aria-label="Insert image">
                  <Image size={16} />
                </button>
              </GlassPanel>
              
              <button 
                onClick={toggleRecording}
                className={`p-2 rounded-lg transition-smooth ${
                  isRecording 
                    ? 'bg-red-500 text-white' 
                    : 'glass text-gray-700 hover:text-gray-900'
                }`}
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
              >
                <Mic size={16} />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg glass border border-white/30 text-gray-700 hover:text-gray-900 transition-smooth" aria-label="Upload file">
                <File size={16} />
              </button>
              <button className="p-2 rounded-lg glass border border-white/30 text-gray-700 hover:text-gray-900 transition-smooth" aria-label="Share note">
                <Share size={16} />
              </button>
              <button className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-smooth flex items-center gap-1.5" aria-label="Save note">
                <Save size={16} />
                <span className="text-sm">Save</span>
              </button>
            </div>
          </div>
          
          {/* Note title */}
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="text-xl font-semibold bg-transparent border-0 border-b border-gray-200 pb-2 mb-4 focus:ring-0 focus:border-primary w-full"
          />
          
          {/* Note content */}
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Start typing your note here..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none text-base leading-relaxed"
          />
          
          {/* Speech-to-text indicator */}
          {isRecording && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium">Recording in progress...</span>
            </div>
          )}
        </AnimatedCard>
      </div>
    </div>
  );
}
