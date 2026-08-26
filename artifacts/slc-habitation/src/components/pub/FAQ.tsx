import { ReactNode } from 'react';

interface FAQProps {
  question: string;
  answer: ReactNode;
}

export function FAQ({ question, answer }: FAQProps) {
  return (
    <details className="pub-faq group">
      <summary className="pub-faq__summary">
        <span>{question}</span>
        <span className="pub-faq__icon" aria-hidden="true">
          <svg fill="none" height="20" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20">
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </summary>
      <div className="pub-faq__answer">
        <div className="border-t border-border/40 pt-4 text-[0.95rem]">
          {answer}
        </div>
      </div>
    </details>
  );
}
