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
  Send,
  Key,
  ExternalLink,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import {
  CHATBOT_CATEGORIES,
  CHATBOT_QUESTIONS,
  type ChatbotQuestion,
  type ChatbotCategory
} from '../data/studyChatbotData';
import type { StudentProfile } from '../types';
import { formatStudentName } from '../utils/languageUtils';
import { GyanSetuApi } from '../api/client';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  questionData?: ChatbotQuestion;
  suggestedFollowUps?: string[];
  isGeminiGenerated?: boolean;
  geminiModel?: string;
  showKeyPrompt?: boolean;
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
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState(true);
  const [customInput, setCustomInput] = useState('');

  // Gemini API key state & modal management
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('gyansetu-gemini-key') || '';
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [keySaveToast, setKeySaveToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync with localStorage if updated from other components (like AdaptionAiModal)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedKey = localStorage.getItem('gyansetu-gemini-key') || '';
      setGeminiApiKey(storedKey);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const rawName = profile?.fullName ? profile.fullName.split(' ')[0] : '';
      const studentName = rawName ? ` ${formatStudentName(rawName, lang)}` : '';
      const initialGreeting =
        lang === 'hi'
          ? `नमस्ते${studentName}! 🙏 मैं आपका **ज्ञानसेतु AI अध्ययन व समय-सारणी सलाहकार** हूँ।\n\nआप नीचे दिए गए **30 पूर्व-निर्धारित प्रमाणित टाइमटेबल** चुन सकते हैं, अथवा **Google Gemini API** से अपने कॉलेज समय, बैकलाग या मनपसंद परीक्षा अनुसार लाइव अध्ययन योजना बनवा सकते हैं:`
          : `Hello${studentName}! 👋 I am your **GyanSetu AI Study Mentor & Timetable Architect**.\n\nYou can select from our **30 verified study timetable guides** below, or ask any custom question to generate real-time, personalized schedules using **Google Gemini AI**:`;

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
    setTypingMessage(lang === 'hi' ? 'टाइमटेबल तैयार हो रहा है...' : 'Crafting timetable plan...');
    setShowQuestionDrawer(false);

    // Simulate snappy AI response delay
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
      setTypingMessage('');
    }, 400);
  };

  // Execute Gemini AI query
  const executeGeminiQuery = async (queryText: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setTypingMessage(
      lang === 'hi'
        ? '⚡ Gemini AI आपकी प्रोफ़ाइल अनुसार योजना बना रहा है...'
        : '⚡ Gemini AI is analyzing your profile & drafting study plan...'
    );
    setShowQuestionDrawer(false);

    try {
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await GyanSetuApi.askStudyChatbot({
        apiKey: geminiApiKey,
        message: queryText,
        lang,
        profile,
        history
      });

      if (res.success && res.reply) {
        const fullText = res.notice
          ? `${res.reply}\n\n> ℹ️ *${res.notice}*`
          : res.reply;

        const botMsg: Message = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text: fullText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isGeminiGenerated: true,
          geminiModel: res.model || 'GyanSetu Study Mentor',
          suggestedFollowUps: ['q1', 'q7', 'q26']
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorBotMsg: Message = {
          id: 'b-' + Date.now(),
          sender: 'bot',
          text:
            lang === 'hi'
              ? `⚠️ **AI से उत्तर प्राप्त नहीं हो सका:**\n\n${res.error || 'अज्ञात त्रुटि'}\n\n💡 आप बिना किसी API Key के **ज्ञानसेतु ऑफलाइन AI मार्गदर्शक** का उपयोग कर सकते हैं। हेडर में Key आइकन पर क्लिक करके **"Use Built-in Mentor"** चुनें।`
              : `⚠️ **Could not generate response:**\n\n${res.error || 'Unknown communication issue'}\n\n💡 You can use **GyanSetu Built-in AI Mentor** without any API key. Click the Key icon in the header and select **"Use Built-in Mentor"**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showKeyPrompt: true
        };
        setMessages((prev) => [...prev, errorBotMsg]);
      }
    } catch (err: any) {
      const errorBotMsg: Message = {
        id: 'b-' + Date.now(),
        sender: 'bot',
        text: `⚠️ **Connection Error:** ${err?.message || 'Network failure communicating with Gemini AI.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showKeyPrompt: true
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsTyping(false);
      setTypingMessage('');
    }
  };

  const handleCustomInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const query = customInput.trim();
    setCustomInput('');

    // Execute query with live AI (Gemini, Groq, OpenRouter) or automatic GyanSetu Smart Offline Mentor
    executeGeminiQuery(query);
  };

  const handleActivateOfflineMentor = () => {
    localStorage.removeItem('gyansetu-gemini-key');
    setGeminiApiKey('OFFLINE_MODE');
    setInputKey('');
    setKeySaveToast(lang === 'hi' ? 'ज्ञानसेतु ऑफलाइन AI मार्गदर्शक सक्रिय! 💡' : 'GyanSetu Built-in AI Mentor Activated! 💡');

    setTimeout(() => {
      setKeySaveToast(null);
      setIsKeyModalOpen(false);
    }, 1200);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    const trimmed = inputKey.trim();
    localStorage.setItem('gyansetu-gemini-key', trimmed);
    setGeminiApiKey(trimmed);

    let providerName = 'API Key';
    if (trimmed.startsWith('gsk_')) providerName = 'Groq (Llama 3.3)';
    else if (trimmed.startsWith('sk-or-')) providerName = 'OpenRouter';
    else if (trimmed.startsWith('AIza')) providerName = 'Google Gemini';

    setKeySaveToast(lang === 'hi' ? `${providerName} सफलतापूर्वक कनेक्ट हो गई! ✨` : `${providerName} connected successfully! ✨`);

    setTimeout(() => {
      setKeySaveToast(null);
      setIsKeyModalOpen(false);
    }, 1200);
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gyansetu-gemini-key');
    setGeminiApiKey('');
    setInputKey('');
    setKeySaveToast(lang === 'hi' ? 'API Key हटा दी गई (ऑफलाइन मोड सक्रिय)।' : 'API Key removed (Default mentor active).');
    setTimeout(() => {
      setKeySaveToast(null);
      setIsKeyModalOpen(false);
    }, 1200);
  };

  const handleResetChat = () => {
    const rawName = profile?.fullName ? profile.fullName.split(' ')[0] : '';
    const studentName = rawName ? ` ${formatStudentName(rawName, lang)}` : '';
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text:
          lang === 'hi'
            ? `बातचीत रीसेट हो गई है। 🙏 नमस्ते${studentName}! कृपया अपना अध्ययन प्रश्न चुनें या टाइप करें:`
            : `Conversation refreshed! 👋 Hello${studentName}, please select any timetable guide below or type any question:`,
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

  // Clean Markdown formatter for bot answers
  const formatBotResponse = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => {
      // Heading level 3
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-extrabold text-slate-900 text-sm mt-2.5 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-4 bg-[#5034df] rounded-full inline-block"></span>
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      // Heading level 4
      if (paragraph.startsWith('#### ')) {
        return (
          <h4 key={idx} className="font-bold text-[#1c1257] text-xs mt-2 mb-1 bg-indigo-50/90 px-2.5 py-1 rounded-lg border border-indigo-100">
            {paragraph.replace('#### ', '')}
          </h4>
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
            <span className={`w-2 h-2 rounded-full ${geminiApiKey ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></span>
            <span>
              {geminiApiKey ? (lang === 'hi' ? 'Gemini AI एक्टिव' : 'Gemini AI Active') : (lang === 'hi' ? 'स्टडी टाइमटेबल बॉट' : 'Study Timetable AI')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative cursor-pointer w-14 h-14 rounded-full bg-gradient-to-r from-[#1c1257] via-[#33209b] to-[#5940e2] text-white flex items-center justify-center shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
            title={lang === 'hi' ? 'अध्ययन टाइमटेबल चैटबॉट खोलें' : 'Open Study Timetable Chatbot'}
          >
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Sparkling Badge */}
            <span aria-hidden="true" className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-[10px] text-white font-extrabold shadow-sm border border-white">
              <Sparkles className="w-3 h-3" />
            </span>
          </button>
        </div>
      )}

      {/* Chatbot Window (Bottom Right) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[460px] md:w-[490px] h-[640px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Top Header Ribbon */}
          <div className="bg-gradient-to-r from-[#1c1257] via-[#33209b] to-[#5940e2] text-white p-3.5 pb-3 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center text-white shadow-inner border border-white/20">
                  <Bot className="w-5 h-5 text-indigo-100" />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${geminiApiKey ? 'bg-emerald-400' : 'bg-amber-400'} rounded-full ring-2 ring-[#1c1257]`}></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm font-extrabold tracking-tight">
                    {lang === 'hi' ? 'ज्ञानसेतु टाइमटेबल AI' : 'GyanSetu Study AI'}
                  </h2>
                  
                  {/* Active AI / Mentor Status Badge */}
                  {geminiApiKey === 'OFFLINE_MODE' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInputKey('');
                        setIsKeyModalOpen(true);
                      }}
                      className="cursor-pointer text-[10px] bg-indigo-500/25 hover:bg-indigo-500/35 text-indigo-200 border border-indigo-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition"
                      title={lang === 'hi' ? 'ज्ञानसेतु ऑफलाइन AI सक्रिय है (API Key बदलने के लिए क्लिक करें)' : 'GyanSetu Built-in Mentor Active (Click to connect external API)'}
                    >
                      <Bot className="w-2.5 h-2.5 text-amber-300" />
                      <span>Built-in Mentor</span>
                      <Check className="w-2.5 h-2.5 text-indigo-300" />
                    </button>
                  ) : geminiApiKey.startsWith('gsk_') ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInputKey(geminiApiKey);
                        setIsKeyModalOpen(true);
                      }}
                      className="cursor-pointer text-[10px] bg-amber-500/25 hover:bg-amber-500/35 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition"
                      title="Groq Llama 3.3 Active"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>Groq Llama 3.3</span>
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </button>
                  ) : geminiApiKey.startsWith('sk-or-') ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInputKey(geminiApiKey);
                        setIsKeyModalOpen(true);
                      }}
                      className="cursor-pointer text-[10px] bg-purple-500/25 hover:bg-purple-500/35 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition"
                      title="OpenRouter Active"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>OpenRouter</span>
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </button>
                  ) : geminiApiKey ? (
                    <button
                      type="button"
                      onClick={() => {
                        setInputKey(geminiApiKey);
                        setIsKeyModalOpen(true);
                      }}
                      className="cursor-pointer text-[10px] bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition"
                      title={lang === 'hi' ? 'Gemini API कनेक्टेड है (बदलने के लिए क्लिक करें)' : 'Gemini AI Connected (Click to view or change key)'}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>Gemini Live AI</span>
                      <Check className="w-2.5 h-2.5 text-emerald-300" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setInputKey('');
                        setIsKeyModalOpen(true);
                      }}
                      className="cursor-pointer text-[10px] bg-indigo-500/25 hover:bg-indigo-500/35 text-indigo-200 border border-indigo-400/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition"
                      title={lang === 'hi' ? 'ऑफलाइन मेंटर सक्रिय (कस्टम API जोड़ने के लिए क्लिक करें)' : 'Built-in Mentor Active (Click to connect Gemini or Groq)'}
                    >
                      <Bot className="w-2.5 h-2.5 text-emerald-300" />
                      <span>Built-in Mentor</span>
                    </button>
                  )}
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
                onClick={() => {
                  setInputKey(geminiApiKey === 'OFFLINE_MODE' ? '' : geminiApiKey);
                  setIsKeyModalOpen(!isKeyModalOpen);
                }}
                className={`cursor-pointer p-1.5 rounded-xl hover:bg-white/15 transition ${geminiApiKey && geminiApiKey !== 'OFFLINE_MODE' ? 'text-emerald-300' : 'text-indigo-200'}`}
                title={lang === 'hi' ? 'AI Key सेटिंग्स' : 'AI Key Settings'}
              >
                <Key className="w-4 h-4" />
              </button>
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

          {/* Inline Key Config Modal / Popover */}
          {isKeyModalOpen && (
            <div className="bg-slate-900 text-white p-4 border-b border-indigo-900/60 shadow-inner animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white">
                    {lang === 'hi' ? 'AI मेंटर इंजन सेटिंग्स' : 'AI Mentor Engine Settings'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="cursor-pointer text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-2.5">
                {lang === 'hi'
                  ? 'आप बिना किसी Key के हमारे इन-बिल्ट मेंटर का उपयोग कर सकते हैं, अथवा Google Gemini (AIzaSy...) या Groq (gsk_...) की मुफ्त Key जोड़ सकते हैं:'
                  : 'You can use our built-in study mentor with zero keys, or connect a free Google Gemini (AIzaSy...) or Groq (gsk_...) API key:'}
              </p>

              {keySaveToast && (
                <div className="mb-2 p-2 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-1.5 font-medium animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{keySaveToast}</span>
                </div>
              )}

              {/* Instant 1-Click Built-in Offline Mentor Button */}
              <div className="mb-3 p-2 bg-indigo-950/60 border border-indigo-700/50 rounded-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-indigo-200">
                      {lang === 'hi' ? 'इन-बिल्ट ज्ञानसेतु मेंटर' : 'Built-in GyanSetu Mentor'}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {lang === 'hi' ? '100% मुफ्त, कोई API Key नहीं चाहिए' : '100% Free • No API Key Needed'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleActivateOfflineMentor}
                  className="cursor-pointer text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg transition shrink-0"
                >
                  {geminiApiKey === 'OFFLINE_MODE' ? (lang === 'hi' ? 'सक्रिय है ✓' : 'Active ✓') : (lang === 'hi' ? 'सक्रिय करें' : 'Use Built-in')}
                </button>
              </div>

              <form onSubmit={handleSaveApiKey} className="space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy... (Gemini) or gsk_... (Groq)"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-3">
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-300 hover:text-indigo-200 underline flex items-center gap-1"
                      title="Generate free Gemini Key (starts with AIzaSy...)"
                    >
                      <span>Gemini Key</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href="https://console.groq.com/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
                      title="Generate free Groq Key for Llama 3.3 (starts with gsk_...)"
                    >
                      <span>Groq (Free Llama)</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {geminiApiKey && geminiApiKey !== 'OFFLINE_MODE' && (
                      <button
                        type="button"
                        onClick={handleRemoveApiKey}
                        className="cursor-pointer text-[11px] text-rose-300 hover:text-rose-200 px-2 py-1 rounded-lg border border-rose-500/30 hover:bg-rose-950/40 transition flex items-center gap-1"
                        title="Remove stored key"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!inputKey.trim()}
                      className="cursor-pointer text-xs font-bold bg-[#5034df] hover:bg-[#3f25c7] text-white px-3 py-1 rounded-lg transition disabled:opacity-40"
                    >
                      {lang === 'hi' ? 'सहेजें (Save)' : 'Save Key'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

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

                <div className={`max-w-[88%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
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

                    {/* Pre-fed Question Bot Answer Actions */}
                    {msg.sender === 'bot' && msg.questionData && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                          <span className="font-semibold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>Q#{msg.questionData.number} Verified Guide</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="cursor-pointer inline-flex items-center gap-1 hover:text-[#5034df] font-medium transition"
                            title="Copy timetable to clipboard"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                                <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Routine</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Personalize with Gemini AI Button */}
                        {geminiApiKey && (
                          <button
                            type="button"
                            onClick={() => {
                              const qPrompt =
                                lang === 'hi'
                                  ? `कृपया इस टाइमटेबल गाइड (#${msg.questionData?.number}: ${msg.questionData?.question}) को विशेष रूप से मेरी शाखा (${profile?.stream || 'इंजीनियरिंग'}), वर्ष (${profile?.currentYear || 3}), और दैनिक कॉलेज समय अनुसार कस्टमाइज़ करें।`
                                  : `Please customize this timetable guide (#${msg.questionData?.number}: ${msg.questionData?.question}) specifically for my profile: ${profile?.currentDegree || 'B.Tech'} ${profile?.stream || ''}, Year ${profile?.currentYear || 3}, targeting ${profile?.careerGoals?.join(', ') || 'GATE & Exams'}.`;
                              executeGeminiQuery(qPrompt);
                            }}
                            className="cursor-pointer w-full text-left p-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/80 rounded-xl transition flex items-center justify-between text-[11px] text-[#5034df] font-bold"
                          >
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>{lang === 'hi' ? 'Gemini AI से मेरी शाखा अनुसार कस्टमाइज़ करें' : 'Personalize for My Branch with Gemini AI'}</span>
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Gemini AI Generated Bot Answer Actions */}
                    {msg.sender === 'bot' && msg.isGeminiGenerated && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Generated by Gemini AI ({msg.geminiModel || 'Flash'})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="cursor-pointer inline-flex items-center gap-1 hover:text-[#5034df] font-medium transition"
                          title="Copy timetable to clipboard"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Plan</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Prompt to Enter Gemini API Key Inline */}
                    {msg.showKeyPrompt && (
                      <div className="mt-3 p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
                        <span className="text-[11px] text-indigo-950 font-semibold flex items-center gap-1">
                          <Key className="w-3.5 h-3.5 text-[#5034df] shrink-0" />
                          <span>{lang === 'hi' ? 'मुफ्त Gemini API Key आवश्यक है' : 'Free Google AI Studio Key Needed'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInputKey(geminiApiKey);
                            setIsKeyModalOpen(true);
                          }}
                          className="cursor-pointer text-xs font-bold bg-[#5034df] hover:bg-[#3f25c7] text-white px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{lang === 'hi' ? 'API Key दर्ज करें' : 'Enter Gemini API Key'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Questions Chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-2 pl-1 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-500" />
                        <span>{lang === 'hi' ? 'संबंधित प्रश्न चुनें:' : 'Next Suggested Guides:'}</span>
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
                  <span className="text-[11px] font-medium text-slate-600 ml-1">
                    {typingMessage || (lang === 'hi' ? 'टाइमटेबल तैयार हो रहा है...' : 'Crafting timetable plan...')}
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
                  {lang === 'hi' ? '30 पूर्व-निर्धारित प्रश्न सूची' : 'Select a Pre-Fed Guide (30 Available)'}
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
                <span>{showQuestionDrawer ? (lang === 'hi' ? 'छिपाएं' : 'Hide List') : (lang === 'hi' ? 'प्रश्न दिखाएं' : 'Show Guides')}</span>
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
                        : 'Search 30 guides (e.g. college, 2 hours, GATE, zero)...'
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
                    <div className="p-4 text-center text-xs text-slate-600 dark:text-slate-400 font-medium">
                      No pre-fed guide matches "{searchQuery}". Try asking Gemini AI below!
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
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium truncate mt-0.5">
                            {q.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#5034df] group-hover:translate-x-0.5 transition shrink-0 mt-1" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Custom Input Form (Powered by Gemini AI) */}
            <form onSubmit={handleCustomInputSubmit} className="p-2.5 bg-white flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder={
                    geminiApiKey
                      ? (lang === 'hi'
                          ? 'Gemini AI से पूछें (उदा: 3 घंटे का शाम का टाइमटेबल, GATE ईई)...'
                          : 'Ask Gemini AI (e.g. 3-hr evening timetable, GATE EE backlog)...')
                      : (lang === 'hi'
                          ? '30 गाइड में खोजें या Gemini API जोड़कर कस्टम पूछें...'
                          : 'Search 30 guides or connect Gemini for custom AI...')
                  }
                  className="w-full pl-3 pr-8 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#5034df]"
                />
                {geminiApiKey && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500" title="Gemini AI active">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="cursor-pointer p-2 rounded-xl bg-[#5034df] hover:bg-[#3f25c7] text-white transition disabled:opacity-40 shrink-0 shadow-sm"
                title={geminiApiKey ? 'Ask Gemini AI' : 'Send / Search Guide'}
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
