// @ts-nocheck
"use client";

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion } from 'framer-motion';
import { Bot, User, Send, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SymptomChecker() {
  const [localInput, setLocalInput] = useState('');
  const { messages, append, isLoading } = useChat({
    api: '/api/triage',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I am the Renate Physio AI assistant. Can you describe what you are struggling with today? E.g., "I hurt my lower back lifting a box yesterday."'
      }
    ]
  });

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!localInput.trim()) return;
    append({ role: 'user', content: localInput });
    setLocalInput('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto border-0 shadow-xl shadow-blue-900/10">
      <CardHeader className="bg-blue-50 border-b border-blue-100 rounded-t-xl pb-6">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bot className="w-6 h-6" />
          AI Symptom Checker
        </CardTitle>
        <CardDescription className="text-blue-700/80">
          Get a preliminary assessment before you book.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] p-6 bg-slate-50/50">
          <div className="space-y-4">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-blue-700" />
                  </div>
                )}
                
                <div 
                  className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-900 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                  }`}
                >
                  {m.content}
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-blue-700" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-slate-100 text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-white border-t border-slate-100 rounded-b-xl">
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <Input
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-blue-900"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !localInput.trim()}
              className="bg-blue-900 hover:bg-blue-800 text-white shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 justify-center">
            <AlertCircle className="w-3 h-3" />
            <p>This is an AI assistant, not medical advice.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
