export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          非同期ブートキャンププラットフォーム
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
          オフライン合宿、オンライン講座、企業研修を一つのプラットフォームで管理
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              オフライン合宿
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              短期集中型のプログラミングブートキャンプや研修合宿を効率的に運営
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              オンライン講座
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              非同期で進められるオンライン学習プログラムの提供と課題管理
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              企業研修
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              社内エンジニア研修やスキルアップ講座の実施と進捗管理
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <a
          href="/camps"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          キャンプ一覧を見る
        </a>
      </div>
    </div>
  );
}
