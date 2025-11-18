import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ユーザーの作成
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@example.com' },
    update: {},
    create: {
      email: 'mentor@example.com',
      name: '田中 太郎（メンター）',
      image: 'https://i.pravatar.cc/150?img=33',
    },
  });

  const learner1 = await prisma.user.upsert({
    where: { email: 'learner1@example.com' },
    update: {},
    create: {
      email: 'learner1@example.com',
      name: '佐藤 花子',
      image: 'https://i.pravatar.cc/150?img=44',
    },
  });

  const learner2 = await prisma.user.upsert({
    where: { email: 'learner2@example.com' },
    update: {},
    create: {
      email: 'learner2@example.com',
      name: '鈴木 一郎',
      image: 'https://i.pravatar.cc/150?img=12',
    },
  });

  console.log('✅ Created users');

  // キャンプの作成
  const reactBootcamp = await prisma.camp.upsert({
    where: { id: 'react-bootcamp-2024' },
    update: {},
    create: {
      id: 'react-bootcamp-2024',
      title: 'React実践ブートキャンプ 2024',
      description:
        'Reactの基礎から実践的なWebアプリケーション開発まで、4週間で習得するプログラムです。モダンな開発手法とベストプラクティスを学びます。',
      startDate: new Date('2024-11-01'),
      endDate: new Date('2024-11-30'),
      visibility: 'public',
    },
  });

  const aiCamp = await prisma.camp.upsert({
    where: { id: 'ai-engineering-camp' },
    update: {},
    create: {
      id: 'ai-engineering-camp',
      title: 'AIエンジニアリング集中講座',
      description:
        'OpenAI APIとLangChainを活用したAIアプリケーション開発を3週間で学ぶプログラムです。実践的なプロジェクトを通じて最先端のAI技術を習得します。',
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-21'),
      visibility: 'public',
    },
  });

  console.log('✅ Created camps');

  // モジュールとミッションの作成（React Bootcamp）
  const module1 = await prisma.module.create({
    data: {
      campId: reactBootcamp.id,
      title: 'React基礎',
      order: 1,
      missions: {
        create: [
          {
            title: 'Reactコンポーネントの作成',
            description:
              '関数コンポーネントを使用して、簡単なプロフィールカードを作成してください。\n\n要件：\n- 名前、職業、自己紹介を表示\n- propsを使用してデータを受け取る\n- Tailwind CSSでスタイリング\n\n提出物：\nコンポーネントのコードとスクリーンショット',
            dueDate: new Date('2024-11-07'),
            aiRubricJson: JSON.stringify({
              criteria: ['コンポーネントの構造', 'propsの適切な使用', 'スタイリング'],
              weights: [0.4, 0.3, 0.3],
            }),
          },
          {
            title: 'useStateフックの理解',
            description:
              'カウンターアプリを作成して、useStateフックの基本を学びます。\n\n要件：\n- ボタンクリックでカウントを増減\n- カウントをリセットする機能\n- 負の数にならないようにする\n\n提出物：\n実装したコードとその説明',
            dueDate: new Date('2024-11-07'),
            aiRubricJson: JSON.stringify({
              criteria: ['useState理解度', '機能実装', 'エラーハンドリング'],
              weights: [0.4, 0.4, 0.2],
            }),
          },
        ],
      },
    },
  });

  const module2 = await prisma.module.create({
    data: {
      campId: reactBootcamp.id,
      title: 'フォームとデータ管理',
      order: 2,
      missions: {
        create: [
          {
            title: 'フォームバリデーション',
            description:
              'ユーザー登録フォームを作成し、バリデーションを実装してください。\n\n要件：\n- メールアドレス、パスワード、確認パスワードの入力\n- リアルタイムバリデーション\n- エラーメッセージの表示\n- React Hook Formまたはネイティブの実装\n\n提出物：\n完成したフォームのコードとデモ動画',
            dueDate: new Date('2024-11-14'),
            aiRubricJson: JSON.stringify({
              criteria: ['バリデーション実装', 'UX設計', 'コード品質'],
              weights: [0.4, 0.3, 0.3],
            }),
          },
        ],
      },
    },
  });

  const module3 = await prisma.module.create({
    data: {
      campId: reactBootcamp.id,
      title: 'APIとの連携',
      order: 3,
      missions: {
        create: [
          {
            title: 'REST API連携',
            description:
              '外部APIからデータを取得して表示するアプリを作成してください。\n\n要件：\n- JSONPlaceholderなどの公開APIを使用\n- ローディング状態の表示\n- エラーハンドリング\n- データの一覧表示と詳細表示\n\n提出物：\n実装コードと動作説明',
            dueDate: new Date('2024-11-21'),
            aiRubricJson: JSON.stringify({
              criteria: ['API統合', '状態管理', 'エラーハンドリング', 'UI/UX'],
              weights: [0.3, 0.3, 0.2, 0.2],
            }),
          },
        ],
      },
    },
  });

  console.log('✅ Created modules and missions for React Bootcamp');

  // AIキャンプのモジュール
  const aiModule1 = await prisma.module.create({
    data: {
      campId: aiCamp.id,
      title: 'OpenAI API基礎',
      order: 1,
      missions: {
        create: [
          {
            title: 'チャットボットの作成',
            description:
              'OpenAI APIを使用して、シンプルなチャットボットを作成してください。\n\n要件：\n- GPT-4を使用\n- 会話履歴の管理\n- ストリーミングレスポンスの実装\n\n提出物：\n動作するアプリケーションとコード',
            dueDate: new Date('2024-12-07'),
          },
        ],
      },
    },
  });

  console.log('✅ Created modules for AI Camp');

  // 参加登録
  await prisma.enrollment.createMany({
    data: [
      { userId: mentor.id, campId: reactBootcamp.id, role: 'mentor' },
      { userId: learner1.id, campId: reactBootcamp.id, role: 'learner' },
      { userId: learner2.id, campId: reactBootcamp.id, role: 'learner' },
      { userId: mentor.id, campId: aiCamp.id, role: 'mentor' },
      { userId: learner1.id, campId: aiCamp.id, role: 'learner' },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created enrollments');

  // サンプル提出物
  const mission1 = await prisma.mission.findFirst({
    where: {
      moduleId: module1.id,
      title: 'Reactコンポーネントの作成',
    },
  });

  if (mission1) {
    const submission1 = await prisma.submission.create({
      data: {
        missionId: mission1.id,
        userId: learner1.id,
        content: `# プロフィールカード実装

以下のコードで実装しました：

\`\`\`tsx
interface ProfileCardProps {
  name: string;
  occupation: string;
  bio: string;
}

export function ProfileCard({ name, occupation, bio }: ProfileCardProps) {
  return (
    <div className="max-w-sm rounded-lg shadow-lg p-6 bg-white">
      <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-600 mt-1">{occupation}</p>
      <p className="text-gray-700 mt-4">{bio}</p>
    </div>
  );
}
\`\`\`

propsを使用してデータを受け取り、Tailwind CSSでスタイリングしました。`,
        status: 'submitted',
        feedbackMarkdown: `## 良かった点
- TypeScriptの型定義が適切に実装されています
- Tailwind CSSのクラスを効果的に使用しています
- コンポーネントの構造がシンプルで理解しやすいです

## 改善点
- aria-label などのアクセシビリティ属性を追加すると良いでしょう
- レスポンシブデザインを考慮したブレークポイントの使用を検討してください
- propsのデフォルト値やバリデーションを追加することをお勧めします

## 次のステップ
- 画像表示機能を追加してみましょう
- ホバー時のアニメーションを実装してみてください
- 複数のプロフィールカードを並べるリスト表示に挑戦してみましょう`,
        score: 85,
      },
    });

    const submission2 = await prisma.submission.create({
      data: {
        missionId: mission1.id,
        userId: learner2.id,
        content: `function ProfileCard(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <p>{props.job}</p>
      <p>{props.about}</p>
    </div>
  );
}`,
        status: 'submitted',
      },
    });

    console.log('✅ Created sample submissions');
  }

  console.log('');
  console.log('🎉 Seed completed successfully!');
  console.log('');
  console.log('📝 Demo credentials:');
  console.log('  Mentor: mentor@example.com');
  console.log('  Learner 1: learner1@example.com');
  console.log('  Learner 2: learner2@example.com');
  console.log('');
  console.log('🔗 Visit http://localhost:3000/camps to see the camps');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
