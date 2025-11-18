'use client';

import { trpc } from '@/lib/trpc-client';
import { useParams } from 'next/navigation';

export default function CampDetailPage() {
  const params = useParams();
  const campId = params.id as string;

  const { data: camp, isLoading } = trpc.camp.getById.useQuery({ id: campId });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!camp) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            キャンプが見つかりません
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

  const now = new Date();
  const isActive = new Date(camp.startDate) <= now && new Date(camp.endDate) >= now;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* キャンプ情報 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {camp.title}
              </h1>
              {isActive && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  開催中
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-2 whitespace-pre-wrap">
              {camp.description}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {new Date(camp.startDate).toLocaleDateString('ja-JP')} -{' '}
            {new Date(camp.endDate).toLocaleDateString('ja-JP')}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {camp.enrollments.length} 人参加
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            {camp.modules.length} モジュール
          </div>
        </div>
      </div>

      {/* モジュール＆ミッション */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          モジュール＆ミッション
        </h2>

        {camp.modules.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              まだモジュールが登録されていません
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {camp.modules.map((module, idx) => (
              <div
                key={module.id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {idx + 1}. {module.title}
                </h3>

                {module.missions.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ミッションがありません
                  </p>
                ) : (
                  <div className="space-y-2">
                    {module.missions.map((mission) => (
                      <a
                        key={mission.id}
                        href={`/missions/${mission.id}`}
                        className="block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {mission.title}
                            </h4>
                            {mission.dueDate && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                期限: {new Date(mission.dueDate).toLocaleDateString('ja-JP')}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {mission._count.submissions} 件の提出
                          </div>
                        </div>
                      </a>
                    ))}
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
