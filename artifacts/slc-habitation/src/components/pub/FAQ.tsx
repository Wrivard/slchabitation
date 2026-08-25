import { ReactNode } from 'react';

interface FAQProps {
  question: string;
  answer: ReactNode;
}

export function FAQ({ question, answer }: FAQProps) {
  return (
    <details className="group bg-white rounded-none border border-border overflow-hidden transition-all">
      <summary className="flex justify-between items-center font-semibold cursor-pointer list-none p-6 text-foreground hover:text-primary transition-colors text-lg">
        <span className="pr-4">{question}</span>
        <span className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-open:rotate-180 text-primary flex-shrink-0">
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </summary>
      <div className="text-muted-foreground px-6 pb-6 leading-relaxed text-base bg-white">
        <div className="pt-2 border-t border-border/30">
          {answer}
        </div>
      </div>
    </details>
  );
}