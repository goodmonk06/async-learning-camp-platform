'use client';

import { trpc } from '@/lib/trpc-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CampDesignerPage() {
  const router = useRouter();
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [design, setDesign] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generateDesign = trpc.designer.generateDesign.useMutation({
    onSuccess: (data) => {
      setDesign(data);
    },
    onError: (error) => {
      alert(`設計生成に失敗しました: ${error.message}`);
    },
  });

  const createCamp = trpc.designer.createFromDesign.useMutation({
    onSuccess: (data) => {
      alert('キャンプが作成されました！');
      router.push(`/camps/${data.id}`);
    },
    onError: (error) => {
      alert(`キャンプ作成に失敗しました: ${error.message}`);
    },
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !duration || !targetAudience) {
      alert('すべての項目を入力してください');
      return;
    }

    generateDesign.mutate({ goal, duration, targetAudience });
  };

  const handleCreate = () => {
    if (!design || !startDate || !endDate) {
      alert('開始日と終了日を入力してください');
      return;
    }

    createCamp.mutate({
      title: design.title,
      description: design.description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      modules: design.modules,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          キャンプ設計支援
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          AIがあなたの目標に合わせた学習キャンプを自動設計します
        </p>
      </div>

      {/* 入力フォーム */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              学習目標
            </label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="例: Reactで実践的なWebアプリケーションを開発できるようになる"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              期間
            </label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="例: 4週間 / 3ヶ月 / 2日間の集中合宿"
            />
          </div>

          <div>
            <label
              htmlFor="targetAudience"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              対象者
            </label>
            <input
              type="text"
              id="targetAudience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              placeholder="例: プログラミング初心者 / 新卒エンジニア / 既存エンジニアのスキルアップ"
            />
          </div>

          <button
            type="submit"
            disabled={generateDesign.isLoading}
            className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generateDesign.isLoading ? 'AI設計中...' : 'AIでキャンプを設計'}
          </button>
        </form>
      </div>

      {/* 生成された設計 */}
      {design && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {design.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{design.description}</p>
          </div>

          {/* モジュール＆ミッション */}
          <div className="space-y-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              カリキュラム
            </h3>
            {design.modules.map((module: any, idx: number) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {module.order}. {module.title}
                </h4>
                <div className="space-y-3">
                  {module.missions.map((mission: any, mIdx: number) => (
                    <div
                      key={mIdx}
                      className="pl-4 border-l-2 border-indigo-500 dark:border-indigo-400"
                    >
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        ミッション {mIdx + 1}: {mission.title}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {mission.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 日付設定とキャンプ作成 */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              キャンプを作成
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  開始日
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  終了日
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCreate}
                disabled={createCamp.isLoading}
                className="flex-1 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCamp.isLoading ? '作成中...' : 'このキャンプを作成'}
              </button>
              <button
                onClick={() => setDesign(null)}
                className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                再設計
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
