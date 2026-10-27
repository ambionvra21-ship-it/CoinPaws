import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';
import { haptics } from '../utils/haptics';

interface DailyTriviaQuizProps {
  answeredDate: string;
  onReward: (phpReward: number, pawsReward: number, title: string) => void;
}

interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  phpReward: number;
  pawsReward: number;
}

const dailyQuestion: TriviaQuestion = {
  question: "Which of the following is a primary characteristic of decentralized passive income systems?",
  options: [
    "Requires active 10-hour work shifts",
    "Utilizes automated resource allocation",
    "Depends entirely on manual credit cards",
    "Requires high hardware maintenance fees"
  ],
  correctIndex: 1,
  phpReward: 5.00,
  pawsReward: 50,
};

export const DailyTriviaQuiz: React.FC<DailyTriviaQuizProps> = ({
  answeredDate,
  onReward,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const isAlreadyAnswered = answeredDate === todayStr;

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const handleOptionSelect = (index: number) => {
    if (hasSubmitted || isAlreadyAnswered) return;
    sound.playClick();
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasSubmitted || isAlreadyAnswered) return;
    
    setHasSubmitted(true);
    const correct = selectedOption === dailyQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      sound.playCoin();
      haptics.tapMine();
      onReward(dailyQuestion.phpReward, dailyQuestion.pawsReward, "Daily Trivia Complete");
    } else {
      sound.playClick();
      haptics.tapMine();
    }
  };

  return (
    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex flex-col justify-between min-h-[170px] relative overflow-hidden">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-amber-400">
          <HelpCircle className="w-4 h-4 stroke-[2.2]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Daily Trivia Quiz</span>
        </div>

        {isAlreadyAnswered ? (
          <div className="flex flex-col items-center justify-center py-6 text-center h-full">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300 mt-2">Quiz Completed!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-1">
            <p className="text-[11px] font-bold text-slate-200 leading-normal line-clamp-2">
              {dailyQuestion.question}
            </p>
            
            <div className="flex flex-col gap-1.5 mt-1">
              {dailyQuestion.options.map((option, idx) => {
                let btnStyle = "bg-slate-950/40 border-slate-800 text-slate-400";
                
                if (selectedOption === idx) {
                  btnStyle = "bg-cyan-500/10 border-cyan-400 text-cyan-300";
                }
                if (hasSubmitted) {
                  if (idx === dailyQuestion.correctIndex) {
                    btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                  } else if (selectedOption === idx) {
                    btnStyle = "bg-rose-500/10 border-rose-500 text-rose-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasSubmitted}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border text-left text-[10px] font-medium transition-all ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!isAlreadyAnswered && (
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800/40 pt-2">
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            <Sparkles className="w-3 h-3 fill-emerald-400 stroke-none" />
            <span>+₱{dailyQuestion.phpReward.toFixed(2)}</span>
          </div>

          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all ${
                selectedOption !== null 
                  ? 'bg-cyan-500 text-slate-950' 
                  : 'bg-slate-800 text-slate-500 opacity-50'
              }`}
            >
              Submit
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-bold">
              {isCorrect ? (
                <span className="text-emerald-400 flex items-center gap-0.5">✔ Correct</span>
              ) : (
                <span className="text-rose-400 flex items-center gap-0.5">✖ Wrong</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
