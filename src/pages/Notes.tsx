import React, { useState } from 'react';
import { 
  FileText, Search, Plus, Star, Tag, Eye, Edit3, 
  Sparkles, Trash2, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import { useNoteStore, Note } from '../store/noteStore';
import { GlassCard } from '../components/GlassCard';

export const Notes: React.FC = () => {
  const { 
    notes, activeNoteId, addNote, updateNote, deleteNote, 
    toggleFavorite, setActiveNoteId, summarizeNoteWithAi, suggestTagsWithAi 
  } = useNoteStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
  const [aiLoading, setAiLoading] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(notes.map((n) => n.category)))];

  const handleCreateNote = () => {
    const newId = addNote({
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing in markdown here...',
      category: 'Personal',
      tags: ['New'],
      favorite: false
    });
    setActiveNoteId(newId);
  };

  const handleContentChange = (content: string) => {
    if (activeNote) {
      updateNote(activeNote.id, { content });
    }
  };

  const handleTitleChange = (title: string) => {
    if (activeNote) {
      updateNote(activeNote.id, { title });
    }
  };

  const handleCategoryChange = (category: string) => {
    if (activeNote) {
      updateNote(activeNote.id, { category });
    }
  };

  const handleTagsChange = (tagsStr: string) => {
    if (activeNote) {
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
      updateNote(activeNote.id, { tags });
    }
  };

  const triggerSummarizer = async () => {
    if (!activeNote) return;
    setAiLoading(true);
    await summarizeNoteWithAi(activeNote.id);
    setAiLoading(false);
  };

  const triggerTagSuggestion = async () => {
    if (!activeNote) return;
    setAiLoading(true);
    await suggestTagsWithAi(activeNote.id);
    setAiLoading(false);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex gap-6 bg-[#111111]/40 border border-[#1E1E1E] rounded-2xl overflow-hidden p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* SIDEBAR: NOTES LIST */}
      <div className="w-80 flex flex-col shrink-0 border-r border-[#1E1E1E] pr-6 min-h-0 space-y-4">
        <button
          onClick={handleCreateNote}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neon-gradient hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] text-black text-xs font-bold transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>

        {/* Search Input */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black border border-[#1E1E1E] text-xs text-white placeholder-[#A0A0A0] focus:border-[#00FF88] focus:outline-none transition-colors"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 shrink-0 border-b border-[#1E1E1E] pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#00FF88]/15 border-[#00FF88]/40 text-[#00FF88]'
                  : 'bg-black/40 border-[#1E1E1E] text-[#A0A0A0] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes list container */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {filteredNotes.map((note) => {
            const isActive = note.id === activeNoteId;
            return (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border flex gap-3 ${
                  isActive
                    ? 'bg-[#1E1E1E] border-[#00FF88]/40 shadow-sm'
                    : 'bg-black/20 border-transparent hover:bg-[#1E1E1E]/40'
                }`}
              >
                <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? 'text-[#00FF88]' : 'text-[#A0A0A0]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-white truncate">{note.title}</p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(note.id);
                      }}
                      className="text-[#A0A0A0] hover:text-yellow-400"
                    >
                      <Star className={`w-3.5 h-3.5 ${note.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#A0A0A0] mt-1 flex justify-between">
                    <span>{note.category}</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            );
          })}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12 text-xs text-[#A0A0A0]">No notes match filters.</div>
          )}
        </div>
      </div>

      {/* EDITOR PANE */}
      {activeNote ? (
        <div className="flex-1 flex flex-col justify-between min-h-0 space-y-4">
          
          {/* Editor Header: Tab bar switcher & metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#1E1E1E] pb-3 shrink-0">
            <div className="flex items-center gap-2 bg-black border border-[#1E1E1E] p-1 rounded-xl">
              <button
                onClick={() => setEditorMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  editorMode === 'edit'
                    ? 'bg-[#1E1E1E] text-[#00FF88]'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write Editor</span>
              </button>
              <button
                onClick={() => setEditorMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  editorMode === 'preview'
                    ? 'bg-[#1E1E1E] text-[#00FF88]'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Markdown Preview</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={triggerSummarizer}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#00FF88]/20 bg-[#00FF88]/5 hover:bg-[#00FF88]/10 text-[#00FF88] text-xs font-bold transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summarize</span>
              </button>
              <button
                onClick={triggerTagSuggestion}
                disabled={aiLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1E1E1E] hover:border-white text-xs font-semibold text-white transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>AI Tags</span>
              </button>
              <button
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 border border-[#1E1E1E] hover:border-[#FF5252] text-[#A0A0A0] hover:text-[#FF5252] rounded-xl transition-colors"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Generated Summaries box */}
          {activeNote.aiSummary && (
            <div className="p-3.5 rounded-xl border-2 border-[#00FF88]/10 bg-[#00FF88]/5 text-xs text-[#00FF88] leading-relaxed shrink-0">
              <span className="font-bold flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                AI Smart Summary
              </span>
              <p className="text-[#A0A0A0]">{activeNote.aiSummary}</p>
            </div>
          )}

          {/* Form Content / TextArea */}
          <div className="flex-1 flex flex-col min-h-0 space-y-4">
            
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Title"
                className="bg-transparent border-none text-white text-base font-bold outline-none focus:ring-1 focus:ring-[#00FF88]/20 rounded px-1.5 py-1"
              />
              <input
                type="text"
                value={activeNote.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                placeholder="Category (e.g. Work, Learn)"
                className="bg-black border border-[#1E1E1E] rounded-xl text-xs text-white px-3 py-1.5 outline-none focus:border-[#00FF88]"
              />
              <input
                type="text"
                value={activeNote.tags.join(', ')}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Tags (separated by comma)"
                className="bg-black border border-[#1E1E1E] rounded-xl text-xs text-white px-3 py-1.5 outline-none focus:border-[#00FF88]"
              />
            </div>

            {/* Note Editor Body */}
            <div className="flex-1 min-h-0 bg-black/40 border border-[#1E1E1E] rounded-2xl p-4 overflow-hidden">
              {editorMode === 'edit' ? (
                <textarea
                  value={activeNote.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-sm leading-relaxed text-white font-mono resize-none"
                  placeholder="Markdown editor. Supports headings, bold list bullets, and blocks..."
                />
              ) : (
                /* MOCK MARKDOWN PREVIEW RENDERER */
                <div className="w-full h-full overflow-y-auto text-sm leading-relaxed space-y-4 text-white pr-2 prose prose-invert max-w-none">
                  {activeNote.content.split('\n').map((line, idx) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={idx} className="text-xl font-bold border-b border-[#1E1E1E] pb-2 pt-1 text-white">{line.replace('# ', '')}</h1>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-base font-semibold pt-2 text-[#00FF88]">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={idx} className="list-disc ml-5 text-[#A0A0A0]">{line.replace('- ', '')}</li>;
                    }
                    if (line.startsWith('```')) {
                      return null; // hide codeblock wrap mocks
                    }
                    return <p key={idx} className={line.trim() ? 'text-[#A0A0A0]' : 'h-2'}>{line}</p>;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[#A0A0A0] text-sm">
          Select a note to read or create one.
        </div>
      )}
    </div>
  );
};
