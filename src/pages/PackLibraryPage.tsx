import { useEffect, useState, useRef } from 'react';
import {
  Plus,
  Search,
  Download,
  Upload,
  Printer,
  Copy,
  Trash2,
  Edit,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from '../router/Router';
import { listQuestionPacks, saveQuestionPack, deleteQuestionPack, initializeDatabase } from '../db/database';
import { QuestionPackSchema } from '../types/game';
import type { QuestionPack } from '../types/game';

export function PackLibraryPage() {
  const { navigate } = useRouter();
  const [packs, setPacks] = useState<QuestionPack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPacks = async () => {
    await initializeDatabase();
    const loaded = await listQuestionPacks();
    setPacks(loaded);
  };

  useEffect(() => {
    loadPacks();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const categories = ['all', ...Array.from(new Set(packs.map((p) => p.category)))];

  const filteredPacks = packs.filter((pack) => {
    const matchesCategory = selectedCategory === 'all' || pack.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesTitle = pack.title.toLowerCase().includes(q);
    const matchesDesc = pack.description.toLowerCase().includes(q);
    const matchesQuestion = pack.questions.some(
      (ques) =>
        ques.prompt.toLowerCase().includes(q) ||
        ques.answers.some((ans) => ans.text.toLowerCase().includes(q))
    );

    return matchesCategory && (matchesTitle || matchesDesc || matchesQuestion);
  });

  const handleCreateNew = async () => {
    const newId = `pack_${Date.now()}`;
    const newPack: QuestionPack = {
      id: newId,
      title: 'New Custom Survey Pack',
      description: 'Custom family survey questions created by host.',
      category: 'Custom',
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: [
        {
          id: `q_${Date.now()}_1`,
          prompt: 'Name something you always keep in your car',
          category: 'Everyday',
          answers: [
            { id: `a_${Date.now()}_1`, text: 'Tissues / Wipes', points: 40, acceptedVariants: ['tissues', 'napkins'], displayOrder: 1 },
            { id: `a_${Date.now()}_2`, text: 'Water Bottle', points: 30, acceptedVariants: ['water', 'drink'], displayOrder: 2 },
            { id: `a_${Date.now()}_3`, text: 'Phone Charger', points: 20, acceptedVariants: ['charger', 'cable'], displayOrder: 3 },
            { id: `a_${Date.now()}_4`, text: 'Umbrella', points: 10, acceptedVariants: [], displayOrder: 4 },
          ],
        },
      ],
    };

    await saveQuestionPack(newPack);
    await loadPacks();
    navigate(`/packs/${newId}/edit`);
  };

  const handleDuplicate = async (pack: QuestionPack) => {
    const dupId = `pack_${Date.now()}`;
    const duplicated: QuestionPack = {
      ...pack,
      id: dupId,
      title: `${pack.title} (Copy)`,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveQuestionPack(duplicated);
    await loadPacks();
    showNotification(`Duplicated "${pack.title}" successfully.`);
  };

  const handleDelete = async (pack: QuestionPack) => {
    if (pack.isBuiltIn) {
      alert('Built-in starter packs cannot be permanently deleted.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${pack.title}"?`)) {
      await deleteQuestionPack(pack.id);
      await loadPacks();
      showNotification(`Deleted pack "${pack.title}".`);
    }
  };

  const handleExportJson = (pack: QuestionPack) => {
    const jsonStr = JSON.stringify(pack, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pack.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pack.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported "${pack.title}" to JSON.`);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        // Runtime Zod validation
        const validated = QuestionPackSchema.safeParse(parsed);

        if (!validated.success) {
          const errs = validated.error.issues.map((i) => i.message).join(', ');
          showNotification(`Import validation error: ${errs}`, 'error');
          return;
        }

        const packToSave: QuestionPack = {
          ...validated.data,
          id: `imported_${Date.now()}`,
          isBuiltIn: false,
          updatedAt: new Date().toISOString(),
        };

        await saveQuestionPack(packToSave);
        await loadPacks();
        showNotification(`Successfully imported "${packToSave.title}"!`);
      } catch (err: unknown) {
        showNotification(`Failed to read file: ${err instanceof Error ? err.message : 'Invalid JSON'}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrintSheet = (pack: QuestionPack) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Host Question Sheet - ${pack.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; color: #111; line-height: 1.4; }
          h1 { margin-bottom: 0.2rem; }
          .pack-desc { color: #555; margin-bottom: 2rem; font-size: 0.95rem; }
          .question-card { page-break-inside: avoid; border: 1px solid #ccc; border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: 1.5rem; }
          .q-title { font-weight: bold; font-size: 1.15rem; margin-bottom: 0.8rem; }
          .answers-table { width: 100%; border-collapse: collapse; }
          .answers-table th, .answers-table td { padding: 6px 10px; border-bottom: 1px solid #eee; text-align: left; }
          .answers-table th { background: #f8f8f8; font-size: 0.85rem; text-transform: uppercase; }
          .pts-col { text-align: right !important; font-weight: bold; }
          .variants { font-size: 0.8rem; color: #666; }
        </style>
      </head>
      <body>
        <h1>${pack.title} — Host Question Sheet</h1>
        <p class="pack-desc">${pack.description} · Total Questions: ${pack.questions.length}</p>
        ${pack.questions
          .map(
            (q, i) => `
          <div class="question-card">
            <div class="q-title">Q${i + 1}. "${q.prompt}"</div>
            <table class="answers-table">
              <thead>
                <tr>
                  <th style="width: 40px">#</th>
                  <th>Answer</th>
                  <th style="width: 80px" class="pts-col">Points</th>
                </tr>
              </thead>
              <tbody>
                ${q.answers
                  .map(
                    (a, aIdx) => `
                  <tr>
                    <td>${aIdx + 1}</td>
                    <td>
                      <strong>${a.text}</strong>
                      ${a.acceptedVariants && a.acceptedVariants.length ? `<div class="variants">Variants: ${a.acceptedVariants.join(', ')}</div>` : ''}
                    </td>
                    <td class="pts-col">${a.points}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `
          )
          .join('')}
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-feud-dark text-white stage-background p-4 sm:p-8 select-none">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-900/60 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white bg-blue-950/60 hover:bg-blue-900 border border-blue-800 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Menu
            </button>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-feud-gold tracking-wide">
              QUESTION PACK LIBRARY
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="bg-feud-gold hover:bg-feud-goldLight text-feud-dark font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-gold-glow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create Custom Pack
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-950 hover:bg-blue-900 border border-blue-700/80 text-blue-200 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl flex items-center gap-1.5"
              title="Import pack from JSON file"
            >
              <Upload className="w-4 h-4" />
              Import JSON
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJson}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div
            className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-green-950/80 border-green-500 text-green-200'
                : 'bg-red-950/80 border-red-500 text-red-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {notification.message}
          </div>
        )}

        {/* FILTER & SEARCH CONTROLS */}
        <div className="bg-[#071638] border border-blue-900/80 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between shadow-md">
          {/* Search box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, prompts, or answers..."
              className="w-full bg-black/50 border border-blue-800 rounded-xl pl-9 pr-4 py-2 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-feud-gold"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-feud-gold text-feud-dark shadow-sm'
                    : 'bg-blue-950/60 hover:bg-blue-900 text-blue-200 border border-blue-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PACK CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPacks.map((pack) => (
            <div
              key={pack.id}
              className="bg-[#071638] border-2 border-blue-900/80 hover:border-feud-gold/70 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-black text-lg text-white group-hover:text-feud-gold transition-colors">
                    {pack.title}
                  </h3>
                  {pack.isBuiltIn ? (
                    <span className="bg-feud-gold/20 text-feud-gold border border-feud-gold/40 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      ★ Built-In
                    </span>
                  ) : (
                    <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                      Custom
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 mb-3">
                  {pack.description}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-4">
                  <span className="bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800 text-blue-300 font-semibold">
                    {pack.category}
                  </span>
                  <span>{pack.questions.length} Questions</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-blue-900/60 pt-3 text-xs">
                <button
                  onClick={() => navigate(`/packs/${pack.id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  {pack.isBuiltIn ? 'View / Edit' : 'Edit'}
                </button>

                <div className="flex items-center gap-1">
                  {/* Print Sheet */}
                  <button
                    onClick={() => handlePrintSheet(pack)}
                    className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800"
                    title="Print Host Question Sheet"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(pack)}
                    className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800"
                    title="Duplicate pack"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {/* Export JSON */}
                  <button
                    onClick={() => handleExportJson(pack)}
                    className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800"
                    title="Export pack to JSON"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete (custom only) */}
                  {!pack.isBuiltIn && (
                    <button
                      onClick={() => handleDelete(pack)}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-900"
                      title="Delete pack"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
