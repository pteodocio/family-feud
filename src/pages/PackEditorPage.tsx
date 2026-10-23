import { useEffect, useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Check, AlertTriangle } from 'lucide-react';
import { useRouter } from '../router/Router';
import { loadQuestionPack, saveQuestionPack } from '../db/database';
import type { QuestionPack, Question, Answer } from '../types/game';

interface PackEditorPageProps {
  packId: string;
}

export function PackEditorPage({ packId }: PackEditorPageProps) {
  const { navigate } = useRouter();
  const [pack, setPack] = useState<QuestionPack | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    loadQuestionPack(packId).then((loaded) => {
      if (loaded) {
        setPack(loaded);
      }
    });
  }, [packId]);

  if (!pack) {
    return (
      <div className="min-h-screen bg-feud-dark text-white flex flex-col items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-feud-gold border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold text-feud-gold">Loading Question Pack...</h2>
      </div>
    );
  }

  const currentQuestion: Question | undefined = pack.questions[activeQuestionIndex];

  const handleSave = async () => {
    await saveQuestionPack(pack);
    setSaveStatus('Saved successfully!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      prompt: 'New survey question prompt',
      category: pack.category || 'General',
      answers: [
        { id: `a_${Date.now()}_1`, text: 'Answer 1', points: 40, acceptedVariants: [], displayOrder: 1 },
        { id: `a_${Date.now()}_2`, text: 'Answer 2', points: 30, acceptedVariants: [], displayOrder: 2 },
        { id: `a_${Date.now()}_3`, text: 'Answer 3', points: 20, acceptedVariants: [], displayOrder: 3 },
        { id: `a_${Date.now()}_4`, text: 'Answer 4', points: 10, acceptedVariants: [], displayOrder: 4 },
      ],
    };

    setPack({
      ...pack,
      questions: [...pack.questions, newQ],
    });
    setActiveQuestionIndex(pack.questions.length);
  };

  const handleDeleteQuestion = (idx: number) => {
    if (pack.questions.length <= 1) {
      alert('Pack must have at least one question.');
      return;
    }
    if (confirm('Delete this question?')) {
      const updated = pack.questions.filter((_, i) => i !== idx);
      setPack({ ...pack, questions: updated });
      setActiveQuestionIndex(Math.max(0, idx - 1));
    }
  };

  const handleUpdatePrompt = (prompt: string) => {
    const updated = [...pack.questions];
    updated[activeQuestionIndex] = { ...updated[activeQuestionIndex], prompt };
    setPack({ ...pack, questions: updated });
  };

  const handleAddAnswer = () => {
    if (!currentQuestion || currentQuestion.answers.length >= 8) return;
    const newAnswer: Answer = {
      id: `a_${Date.now()}`,
      text: 'New Answer',
      points: 10,
      acceptedVariants: [],
      displayOrder: currentQuestion.answers.length + 1,
    };
    const updatedQ = {
      ...currentQuestion,
      answers: [...currentQuestion.answers, newAnswer],
    };
    const updatedQuestions = [...pack.questions];
    updatedQuestions[activeQuestionIndex] = updatedQ;
    setPack({ ...pack, questions: updatedQuestions });
  };

  const handleUpdateAnswer = (ansIdx: number, updates: Partial<Answer>) => {
    if (!currentQuestion) return;
    const updatedAnswers = [...currentQuestion.answers];
    updatedAnswers[ansIdx] = { ...updatedAnswers[ansIdx], ...updates };
    const updatedQ = { ...currentQuestion, answers: updatedAnswers };
    const updatedQuestions = [...pack.questions];
    updatedQuestions[activeQuestionIndex] = updatedQ;
    setPack({ ...pack, questions: updatedQuestions });
  };

  const handleDeleteAnswer = (ansIdx: number) => {
    if (!currentQuestion || currentQuestion.answers.length <= 2) {
      alert('A question must have at least 2 answers.');
      return;
    }
    const updatedAnswers = currentQuestion.answers.filter((_, i) => i !== ansIdx);
    const updatedQ = { ...currentQuestion, answers: updatedAnswers };
    const updatedQuestions = [...pack.questions];
    updatedQuestions[activeQuestionIndex] = updatedQ;
    setPack({ ...pack, questions: updatedQuestions });
  };

  const totalPoints = currentQuestion?.answers.reduce((s, a) => s + a.points, 0) ?? 0;

  return (
    <div className="min-h-screen bg-feud-dark text-white stage-background p-4 sm:p-8 select-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* TOP HEADER */}
        <div className="flex items-center justify-between border-b border-blue-900/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/packs')}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-800 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Packs Library
            </button>
            <h1 className="font-display font-black text-2xl text-feud-gold tracking-wide">
              QUESTION PACK EDITOR
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="text-xs font-bold text-green-400 bg-green-950/80 px-3 py-1 rounded-full border border-green-700 animate-fadeIn">
                {saveStatus}
              </span>
            )}

            <button
              onClick={handleSave}
              className="bg-feud-gold hover:bg-feud-goldLight text-feud-dark font-black text-xs sm:text-sm px-5 py-2 rounded-xl shadow-gold-glow flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* PACK METADATA */}
        <div className="bg-[#071638] border border-blue-900 rounded-2xl p-4 shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-feud-gold mb-1">
              Pack Title
            </label>
            <input
              type="text"
              value={pack.title}
              onChange={(e) => setPack({ ...pack, title: e.target.value })}
              className="w-full bg-black/50 border border-blue-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-feud-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-feud-gold mb-1">
              Category
            </label>
            <input
              type="text"
              value={pack.category}
              onChange={(e) => setPack({ ...pack, category: e.target.value })}
              className="w-full bg-black/50 border border-blue-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Description
            </label>
            <input
              type="text"
              value={pack.description}
              onChange={(e) => setPack({ ...pack, description: e.target.value })}
              className="w-full bg-black/50 border border-blue-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* QUESTIONS NAVIGATION & EDITOR */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Question List Sidebar */}
          <div className="md:col-span-4 bg-[#071638] border border-blue-900 rounded-2xl p-4 flex flex-col gap-2 max-h-[550px] overflow-y-auto shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-feud-gold">
                Questions ({pack.questions.length})
              </span>
              <button
                onClick={handleAddQuestion}
                className="p-1 bg-blue-900 hover:bg-blue-800 text-blue-200 rounded-lg text-xs font-bold flex items-center gap-1"
                title="Add new question"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            {pack.questions.map((q, idx) => (
              <div
                key={q.id}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  activeQuestionIndex === idx
                    ? 'bg-[#0f2c69] border-feud-gold font-bold text-white'
                    : 'bg-[#05112e] border-blue-900 hover:border-blue-700 text-gray-300'
                }`}
              >
                <span className="truncate pr-2">
                  <span className="text-feud-gold mr-1">{idx + 1}.</span>
                  {q.prompt}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteQuestion(idx);
                  }}
                  className="text-gray-500 hover:text-red-400 p-1 shrink-0"
                  title="Delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Active Question Editor */}
          <div className="md:col-span-8 bg-[#071638] border border-blue-900 rounded-2xl p-5 shadow-md flex flex-col gap-4">
            {currentQuestion ? (
              <>
                {/* Prompt input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase text-feud-gold">
                      Question Prompt ({activeQuestionIndex + 1} of {pack.questions.length})
                    </label>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        totalPoints === 100
                          ? 'bg-green-950 text-green-300 border border-green-700'
                          : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}
                    >
                      {totalPoints === 100 ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      Total: {totalPoints} / 100 pts
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={currentQuestion.prompt}
                    onChange={(e) => handleUpdatePrompt(e.target.value)}
                    className="w-full bg-black/60 border border-blue-700 rounded-xl p-3 text-white font-bold text-sm focus:outline-none focus:border-feud-gold"
                  />
                </div>

                {/* Answers Table */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-gray-300">
                      Answers ({currentQuestion.answers.length} slots)
                    </span>
                    <button
                      onClick={handleAddAnswer}
                      disabled={currentQuestion.answers.length >= 8}
                      className="bg-blue-950 hover:bg-blue-900 disabled:opacity-40 text-blue-300 border border-blue-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Answer
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto pr-1">
                    {currentQuestion.answers.map((ans, aIdx) => (
                      <div
                        key={ans.id}
                        className="bg-[#0b1f4c] border border-blue-900 rounded-xl p-2.5 flex items-center gap-2 text-xs"
                      >
                        <span className="w-6 h-6 rounded-full bg-black/50 border border-blue-700 flex items-center justify-center font-bold text-feud-gold shrink-0">
                          {aIdx + 1}
                        </span>

                        {/* Answer Text */}
                        <input
                          type="text"
                          value={ans.text}
                          onChange={(e) => handleUpdateAnswer(aIdx, { text: e.target.value })}
                          placeholder="Answer text"
                          className="flex-1 bg-black/50 border border-blue-700/60 rounded-lg px-2.5 py-1 text-white font-bold"
                        />

                        {/* Accepted Variants */}
                        <input
                          type="text"
                          value={(ans.acceptedVariants || []).join(', ')}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const split = raw.split(',').map((s) => s.trim()).filter(Boolean);
                            handleUpdateAnswer(aIdx, { acceptedVariants: split });
                          }}
                          placeholder="Variants (e.g. stove, oven)"
                          className="w-48 bg-black/50 border border-blue-700/60 rounded-lg px-2 py-1 text-gray-300 text-[11px]"
                          title="Comma-separated accepted synonyms"
                        />

                        {/* Points */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] text-gray-400">Pts:</span>
                          <input
                            type="number"
                            value={ans.points}
                            onChange={(e) =>
                              handleUpdateAnswer(aIdx, { points: Number(e.target.value) })
                            }
                            className="w-14 bg-black/60 border border-blue-600 rounded-lg px-1.5 py-1 text-white font-mono font-bold text-center"
                          />
                        </div>

                        {/* Delete Answer */}
                        <button
                          onClick={() => handleDeleteAnswer(aIdx)}
                          className="p-1 text-gray-500 hover:text-red-400 shrink-0"
                          title="Delete answer slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center p-12 text-gray-400 text-sm">
                No question selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
