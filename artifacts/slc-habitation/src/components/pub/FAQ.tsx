import { ReactNode } from 'react';

interface FAQProps {
  question: string;
  answer: ReactNode;
}

export function FAQ({ question, answer }: FAQProps) {
  return (
    <details className="group bg-white rounded-xl border border-border">
      <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-foreground hover:text-primary transition-colors">
        <span className="pr-4">{question}</span>
        <span className="transition-transform duration-300 group-open:rotate-180 text-primary flex-shrink-0">
          <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </summary>
      <div className="text-muted-foreground px-5 pb-5 leading-relaxed">
        {answer}
      </div>
    </details>
  );
}
