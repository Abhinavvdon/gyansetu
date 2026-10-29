import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Bot,
  X,
  Sparkles,
  Calendar,
  GraduationCap,
  BookOpen,
  Compass,
  Clock,
  Search,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  HelpCircle,
  Flame,
  Send
} from 'lucide-react';
import {
  CHATBOT_CATEGORIES,
  CHATBOT_QUESTIONS,
  type ChatbotQuestion,
  type ChatbotCategory
} from '../data/studyChatbotData';
import type { StudentProfile } from '../types';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  questionData?: ChatbotQuestion;
  suggestedFollowUps?: string[];
}

interface StudyChatbotProps {
  lang?: 'en' | 'hi';
  profile?: StudentProfile | null;
}

export const StudyChatbot: React.FC<StudyChatbotProps> = ({
  lang = 'en',
  profile
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState(true);
  const [customInput, setCustomInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const studentName = profile?.name ? ` ${profile.name}` : '';
      const initialGreeting =
        lang === 'hi'
          ? `नमस्ते${studentName}! 🙏 मैं आपका **ज्ञानसेतु स्टडी टाइमटेबल व शेड्यूल असिस्टेंट** हूँ।\n\nकॉलेज शेड्यूल, सरकारी परीक्षाओं, बैकलाग रिकवरी या सीमित समय के लिए टाइमटेबल की योजना बनानी हो—आप नीचे दिए गए **30 विशिष्ट अध्ययन प्रश्नों** में से कोई भी प्रश्न चुन सकते हैं:`
          : `Hello${studentName}! 👋 I am your **GyanSetu Study Timetable & Scheduling Assistant**.\n\nWhether you need a daily routine around college hours, multiple exam balance, backlog recovery, or a 2-hour high-yield study plan—**select any of our 30 pre-fed study planning questions below** to get started:`;

      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: ['q1', 'q7', 'q26', 'q20']
        }
      ]);
    }
  }, [lang, profile]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Filter questions based on category and search
  const filteredQuestions = CHATBOT_QUESTIONS.filter((q) => {
    const matchesCategory = activeCategory === 'all' || q.categoryId === activeCategory;
    const qText = (q.question + ' ' + q.questionHi + ' ' + q.summary + ' ' + q.tags.join(' ')).toLowerCase();
    const matchesSearch = !searchQuery.trim() || qText.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectQuestion = (q: ChatbotQuestion) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: lang === 'hi' ? q.questionHi : q.question,
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setShowQuestionDrawer(false); // Collapse drawer for clean chat view

    // Simulate smart AI typing delay
    setTimeout(() => {
      const botMsg: Message = {
        id: 'b-' + Date.now(),
        sender: 'bot',
        text: lang === 'hi' ? q.answerHi : q.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        questionData: q,
        suggestedFollowUps: q.suggestedFollowUpIds
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const query = customInput.trim().toLowerCase();
    // Search best match in the 30 pre-fed questions
    const match = CHATBOT_QUESTIONS.find((q) => {
      const full = (q.question + ' ' + q.questionHi + ' ' + q.tags.join(' ')).toLowerCase();
      return full.includes(query);
    });

    if (match) {
      handleSelectQuestion(match);
      setCustomInput('');
    } else {
      // Find top 3 partial keyword matches
      const partials = CHATBOT_QUESTIONS.filter((q) => {
        const words = query.split(' ').filter((w) => w.length > 2);
        return words.some(
          (w) =>
            q.question.toLowerCase().includes(w) ||
            q.questionHi.toLowerCase().includes(w) ||
            q.tags.some((t) => t.includes(w))
        );
      });

      const userMsg: Message = {
        id: 'u-' + Date.now(),
        sender: 'user',
        text: customInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg]);
      setCustomInput('');
      setIsTyping(true);

      setTimeout(() => {
        const botMsg: Message = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text:
            lang === 'hi'
              ? `मैं विशेष रूप से नीचे सूचीबद्ध **30 अध्ययन व टाइमटेबल प्रश्नों** के लिए प्रशिक्षित हूँ। आपके विषय से संबंधित ये प्रश्न उपयोगी हो सकते हैं:`
              : `I am specialized to answer our **30 pre-fed study timetable & scheduling questions**. Here are the closest questions related to your query:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: partials.length > 0 ? partials.slice(0, 3).map((p) => p.id) : ['q1', 'q7', 'q26']
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        setShowQuestionDrawer(true);
      }, 400);
    }
  };

  const handleResetChat = () => {
    const studentName = profile?.name ? ` ${profile.name}` : '';
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text:
          lang === 'hi'
            ? `बातचीत रीसेट हो गई है। 🙏 नमस्ते${studentName}! कृपया अपना अध्ययन प्रश्न चुनें:`
            : `Conversation refreshed! 👋 Hello${studentName}, please select any study timetable question below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: ['q1', 'q7', 'q26', 'q20']
      }
    ]);
    setShowQuestionDrawer(true);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-3.5 h-3.5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'BookOpen':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'Compass':
        return <Compass className="w-3.5 h-3.5" />;
      case 'Clock':
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // Simple Markdown-like formatter for bot answers
  const formatBotResponse = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      // Heading level 3
      if (paragraph.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-extrabold text-slate-900 text-sm mt-2 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-[#5034df] rounded-full inline-block"></span>
            {paragraph.replace('### ', '')}
          </h4>
        );
      }
      // Heading level 4
      if (paragraph.startsWith('#### ')) {
        return (
          <h5 key={idx} className="font-bold text-[#1c1257] text-xs mt-2.5 mb-1 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/80">
            {paragraph.replace('#### ', '')}
          </h5>
        );
      }
      // Blockquote / Alert
      if (paragraph.startsWith('> ')) {
        return (
          <div key={idx} className="bg-amber-50/90 border-l-4 border-amber-500 text-amber-900 p-2.5 rounded-r-xl text-xs my-2 font-medium">
            {paragraph.replace('> ', '')}
          </div>
        );
      }
      // Bullet list
      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={idx} className="space-y-1.5 my-2">
            {items.map((item, itemIdx) => {
              const text = item.replace(/^[\*\-]\s+/, '');
              return (
                <li key={itemIdx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5034df] mt-1.5 shrink-0"></span>
                  <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </li>
              );
            })}
          </ul>
        );
      }
      // Normal paragraph with bold highlights
      return (
        <p
          key={idx}
          className="text-xs text-slate-700 leading-relaxed my-1.5"
          dangerouslySetInnerHTML={{
            __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          }}
        />
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Subtle Attention Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-indigo-100 text-[#1c1257] text-xs font-bold animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === 'hi' ? 'स्टडी टाइमटेबल बॉट' : 'Study Timetable AI'}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative cursor-pointer w-14 h-14 rounded-full bg-gradient-to-r from-[#1c1257] via-[#33209b] to-[#5940e2] text-white flex items-center justify-center shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
            title={lang === 'hi' ? 'अध्ययन टाइमटेबल चैटबॉट खोलें' : 'Open Study Timetable Chatbot'}
          >
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Sparkling Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm border border-white">
              <Sparkles className="w-3 h-3" />
            </span>
          </button>
        </div>
      )}

      {/* Chatbot Window (Bottom Right) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[450px] md:w-[480px] h-[640px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Top Header Ribbon */}
          <div className="bg-gradient-to-r from-[#1c1257] via-[#33209b] to-[#5940e2] text-white p-4 pb-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-white shadow-inner border border-white/20">
                  <Bot className="w-5 h-5 text-indigo-100" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#1c1257]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold tracking-tight">
                    {lang === 'hi' ? 'ज्ञानसेतु टाइमटेबल बॉट' : 'GyanSetu Study Timetable Bot'}
                  </h3>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-md font-semibold text-indigo-100">
                    30 Guides
                  </span>
                </div>
                <p className="text-[11px] text-indigo-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{lang === 'hi' ? 'स्मार्ट अध्ययन योजना व समय-सारणी' : 'Expert Schedules & Exam Planning'}</span>
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="cursor-pointer p-1.5 rounded-xl hover:bg-white/15 text-indigo-100 hover:text-white transition"
                title={lang === 'hi' ? 'चैट रीसेट करें' : 'Reset Chat'}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer p-1.5 rounded-xl hover:bg-white/15 text-indigo-100 hover:text-white transition"
                title={lang === 'hi' ? 'बंद करें' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-left">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#33209b] to-[#5940e2] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className={`max-w-[85%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#5034df] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      formatBotResponse(msg.text)
                    ) : (
                      <p className="font-medium">{msg.text}</p>
                    )}

                    {/* Copy Button for Bot Answers */}
                    {msg.sender === 'bot' && msg.questionData && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-indigo-600 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Q#{msg.questionData.number} Verified Plan</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="cursor-pointer inline-flex items-center gap-1 hover:text-[#5034df] font-medium transition"
                          title="Copy timetable to clipboard"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Routine</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Questions Chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-2 pl-1 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>{lang === 'hi' ? 'संबंधित प्रश्न चुनें:' : 'Next Suggested Questions:'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((fid) => {
                          const fq = CHATBOT_QUESTIONS.find((q) => q.id === fid);
                          if (!fq) return null;
                          return (
                            <button
                              key={fid}
                              type="button"
                              onClick={() => handleSelectQuestion(fq)}
                              className="cursor-pointer text-[11px] bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-950 font-semibold px-2.5 py-1 rounded-xl transition shadow-2xs text-left"
                            >
                              <span>👉 {lang === 'hi' ? fq.questionHi : fq.question}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 mt-1 inline-block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-[#5034df] flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] font-medium text-slate-500 ml-1">
                    {lang === 'hi' ? 'टाइमटेबल तैयार हो रहा है...' : 'Crafting timetable plan...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Pre-fed Question Selector Drawer */}
          <div className="bg-white border-t border-slate-200/90 flex flex-col shrink-0">
            {/* Header toggle for Question Library */}
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#5034df]" />
                <span className="text-[11px] font-bold text-slate-700">
                  {lang === 'hi' ? '30 पूर्व-निर्धारित प्रश्न सूची' : 'Select a Pre-Fed Question (30 Available)'}
                </span>
                <span className="text-[10px] bg-indigo-100 text-[#5034df] px-1.5 py-0.2 rounded-full font-bold">
                  {filteredQuestions.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowQuestionDrawer(!showQuestionDrawer)}
                className="cursor-pointer text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 transition"
              >
                <span>{showQuestionDrawer ? (lang === 'hi' ? 'छिपाएं' : 'Hide List') : (lang === 'hi' ? 'प्रश्न दिखाएं' : 'Show Questions')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuestionDrawer ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expandable Drawer Content */}
            {showQuestionDrawer && (
              <div className="p-3 space-y-2.5 max-h-[220px] overflow-y-auto bg-slate-50/50">
                {/* Search Bar inside Drawer */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      lang === 'hi'
                        ? 'प्रश्नों में खोजें (उदा: 2 घंटे, कॉलेज, GATE, कमजोर विषय)...'
                        : 'Search 30 questions (e.g. college, 2 hours, GATE, zero)...'
                    }
                    className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#5034df]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 transition ${
                      activeCategory === 'all'
                        ? 'bg-[#5034df] text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    All (30)
                  </button>
                  {CHATBOT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`cursor-pointer text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 transition ${
                        activeCategory === cat.id
                          ? 'bg-[#5034df] text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {getCategoryIcon(cat.icon)}
                      <span>{lang === 'hi' ? cat.nameHi : cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Filtered Question Cards */}
                <div className="space-y-1.5 text-left">
                  {filteredQuestions.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No pre-fed question matches "{searchQuery}". Try "college", "hours", or "exam".
                    </div>
                  ) : (
                    filteredQuestions.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handleSelectQuestion(q)}
                        className="cursor-pointer w-full text-left p-2.5 bg-white hover:bg-indigo-50/70 border border-slate-200/90 hover:border-indigo-300 rounded-xl transition flex items-start gap-2 shadow-2xs group"
                      >
                        <span className="text-[10px] font-extrabold text-[#5034df] bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-md shrink-0 mt-0.5">
                          #{q.number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-900 leading-snug">
                            {lang === 'hi' ? q.questionHi : q.question}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {q.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#5034df] group-hover:translate-x-0.5 transition shrink-0 mt-1" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Custom Input / Smart Selector Form */}
            <form onSubmit={handleCustomInputSubmit} className="p-2.5 bg-white flex items-center gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? '30 प्रश्नों में से कोई भी प्रश्न टाइप करें या चुनें...'
                    : 'Type keyword or question number (1-30)...'
                }
                className="flex-1 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#5034df]"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="cursor-pointer p-2 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white transition disabled:opacity-40 shrink-0"
                title="Send / Match question"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
