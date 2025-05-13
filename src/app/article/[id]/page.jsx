import DetailBody from '@/components/section/twoColumn/DetailBody';
import getAllContentList from '@/fetch/getAllContentList';
import getDetails from '@/fetch/getDetails';
import Banner from '@/components/common/Banner';
import Breadcrumb from '@/components/common/Breadcrumb';
import TagArea from '@/components/common/TagArea';
import TagKeyword from '@/components/common/TagKeyword';
import Feature from '@/components/section/feature/Feature';

export async function generateMetadata({ params }) {
  const item = await getDetails(params.id);
  return {
    title: item.subject,
    description: item.introduction,
    openGraph: {
      images: [
        {
          url: item.image.url,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch('https://kamatsumoto.g.kuroco.app'); // ← 実際のAPIに変更してください

    // API呼び出しに失敗していないかチェック
    if (!res.ok) {
      console.error('Failed to fetch data. Status:', res.status);
      return []; // 安全のため空配列を返す
    }

    const data = await res.json();

    // データが配列かどうか確認（ここが超重要）
    if (!Array.isArray(data)) {
      console.error('Invalid response format: expected array, got:', data);
      return []; // 不正な形式でも空配列を返す
    }

    // 正常な配列であれば map 実行
    return data.map((feature) => ({
      id: feature.id.toString(),
    }));

  } catch (error) {
    console.error('generateStaticParams() error:', error);
    return [];
  }
}



export async function fetchArticles() {
  const res = await fetch('https://kamatsumoto.g.kuroco.app');
  const data = await res.json();
  return data;
}


export default async function Page({ params }) {
  const item = await getDetails(params.id);

  const paths = [
    {
      href: `/article?topic=${item.contents_type_nm.toLowerCase()}`,
      label: item.contents_type_ext_col_01,
    },
    { label: '記事詳細' },
  ];

  return (
    <div className='l-container'>
      <div className='u-bg-white'>
        <Breadcrumb paths={paths} />
        <div className='l-container--large c-article'>
          <main>
            <DetailBody data={item} params={params} />
          </main>
        </div>
      </div>
      <div className='l-container--large'>
        <Feature />
        <TagArea />
        <TagKeyword />
        <Banner />
      </div>
    </div>
  );
}
