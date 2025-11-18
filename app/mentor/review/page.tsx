'use client';

import { trpc } from '@/lib/trpc-client';
import { useState } from 'react';

export default function MentorReviewPage() {
  const { data: submissions, isLoading } = trpc.submission.getPendingReview.useQuery();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number>(0);

  const utils = trpc.useUtils();
  const updateSubmission = trpc.submission.update.useMutation({
    onSuccess: () => {
      utils.submission.getPendingReview.invalidate();
      setSelectedSubmission(null);
      setFeedback('');
      setScore(0);
      alert('レビューが完了しました！');
    },
  });

  const handleReview = (submissionId: string) => {
    if (!feedback.trim()) {
      alert('フィードバックを入力してください');
      return;
    }

    updateSubmission.mutate({
      id: submissionId,
      status: 'reviewed',
      score: score || undefined,
      feedbackMarkdown: feedback,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          メンターレビュー
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          提出された課題をレビューしてフィードバックを提供します
        </p>
      </div>

      {submissions?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            レビュー待ちの提出物はありません
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            すべての提出物がレビュー済みです
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {submissions?.map((submission) => (
            <div
              key={submission.id}
              className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                {/* ヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {submission.mission.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {submission.mission.module.camp.title} -{' '}
                      {submission.mission.module.title}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    レビュー待ち
                  </span>
                </div>

                {/* 提出者情報 */}
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                    {submission.user.name?.[0] || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {submission.user.name || submission.user.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      提出日時: {new Date(submission.createdAt).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>

                {/* 提出内容 */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    提出内容
                  </h4>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {submission.content}
                    </p>
                  </div>
                </div>

                {/* AIフィードバック */}
                {submission.feedbackMarkdown && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      AIフィードバック（参考）
                    </h4>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300">
                        {submission.feedbackMarkdown}
                      </pre>
                    </div>
                  </div>
                )}

                {/* レビューフォーム */}
                {selectedSubmission === submission.id ? (
                  <div className="mt-4 p-4 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      メンターレビューを追加
                    </h4>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        スコア（0-100）
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value))}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        フィードバック（Markdown形式）
                      </label>
                      <textarea
                        rows={6}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                        placeholder="## 良かった点&#10;- &#10;&#10;## 改善点&#10;- &#10;&#10;## 次のステップ&#10;- "
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(submission.id)}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        レビュー完了
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSubmission(null);
                          setFeedback('');
                          setScore(0);
                        }}
                        className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedSubmission(submission.id)}
                    className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    レビューする
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
