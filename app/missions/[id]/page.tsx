'use client';

import { trpc } from '@/lib/trpc-client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function MissionDetailPage() {
  const params = useParams();
  const missionId = params.id as string;

  const { data: mission, isLoading } = trpc.mission.getById.useQuery({ id: missionId });
  const [submissionContent, setSubmissionContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = trpc.useUtils();
  const createSubmission = trpc.submission.create.useMutation({
    onSuccess: () => {
      utils.mission.getById.invalidate({ id: missionId });
      setSubmissionContent('');
      setIsSubmitting(false);
      alert('提出が完了しました！AIフィードバックを生成中です...');
    },
    onError: (error) => {
      setIsSubmitting(false);
      alert(`提出に失敗しました: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionContent.trim()) {
      alert('提出内容を入力してください');
      return;
    }

    setIsSubmitting(true);
    // デモ用のダミーユーザーID（本来はNextAuthなどで取得）
    createSubmission.mutate({
      missionId,
      userId: 'demo-user-id',
      content: submissionContent,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ミッションが見つかりません
          </h1>
          <a
            href="/camps"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
          >
            キャンプ一覧に戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* パンくずリスト */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <li>
            <a href="/camps" className="hover:text-indigo-600">
              キャンプ一覧
            </a>
          </li>
          <li>/</li>
          <li>
            <a href={`/camps/${mission.module.camp.id}`} className="hover:text-indigo-600">
              {mission.module.camp.title}
            </a>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-white font-medium">{mission.title}</li>
        </ol>
      </nav>

      {/* ミッション詳細 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {mission.title}
        </h1>

        {mission.dueDate && (
          <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            期限: {new Date(mission.dueDate).toLocaleDateString('ja-JP')}
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            課題内容
          </h3>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {mission.description}
          </p>
        </div>
      </div>

      {/* 提出フォーム */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          課題を提出
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              提出内容
            </label>
            <textarea
              id="content"
              rows={10}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"
              placeholder="ここに提出内容を入力してください..."
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '提出中...' : '提出する'}
          </button>
        </form>
      </div>

      {/* 提出履歴 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          提出履歴
        </h2>

        {mission.submissions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">まだ提出がありません</p>
        ) : (
          <div className="space-y-6">
            {mission.submissions.map((submission) => (
              <div
                key={submission.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                      {submission.user.name?.[0] || 'U'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {submission.user.name || submission.user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(submission.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.score !== null && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        スコア: {submission.score}/100
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.status === 'reviewed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {submission.status === 'submitted' && '提出済み'}
                      {submission.status === 'reviewed' && 'レビュー済み'}
                      {submission.status === 'revised' && '修正済み'}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    提出内容
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {submission.content}
                  </p>
                </div>

                {submission.feedbackMarkdown && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      フィードバック
                    </h4>
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 dark:text-gray-300">
                        {submission.feedbackMarkdown}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
