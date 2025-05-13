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
    const res = await fetch('https://kamatsumoto.g.kuroco.app'); // ← 実際のAPIに書き換えてください

    // ステータスコードチェック
    if (!res.ok) {
      console.error('API fetch failed. Status:', res.status);
      return [];
    }

    const data = await res.json();

    // nullや配列以外が返ってきた場合のチェック
    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data);
      return [];
    }

    // 正常な場合にのみ map を呼び出す
    return data.map((item) => ({
      id: item.id.toString(),
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
