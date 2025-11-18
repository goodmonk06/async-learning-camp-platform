'use client';

import { trpc } from '@/lib/trpc-client';

export default function CampsPage() {
  const { data: camps, isLoading } = trpc.camp.getAll.useQuery();
  const { data: activeCamps } = trpc.camp.getActive.useQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            キャンプ一覧
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            開催中・過去のキャンプを閲覧できます
          </p>
        </div>
      </div>

      {/* 開催中のキャンプ */}
      {activeCamps && activeCamps.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            開催中のキャンプ
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeCamps.map((camp) => (
              <CampCard key={camp.id} camp={camp} isActive={true} />
            ))}
          </div>
        </div>
      )}

      {/* すべてのキャンプ */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          すべてのキャンプ
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {camps?.map((camp) => {
            const isActive = new Date(camp.startDate) <= now && new Date(camp.endDate) >= now;
            return <CampCard key={camp.id} camp={camp} isActive={isActive} />;
          })}
        </div>

        {camps?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              まだキャンプが登録されていません
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CampCard({ camp, isActive }: { camp: any; isActive: boolean }) {
  return (
    <a
      href={`/camps/${camp.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {camp.title}
          </h3>
          {isActive && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              開催中
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {camp.description}
        </p>
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 mr-2"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {camp._count.enrollments} 人参加
            </div>
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {camp._count.modules} モジュール
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
