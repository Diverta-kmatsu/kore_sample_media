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
    const res = await fetch('https://github.com/Diverta-kmatsu/kore_sample_media'); // ← 実際のAPIに置き換えてください

    // レスポンス失敗時
    if (!res.ok) {
      console.error('APIからの取得に失敗しました: ', res.status);
      return [];
    }

    const features = await res.json();

    // データ形式チェック
    if (!Array.isArray(features)) {
      console.error('不正な形式のデータが返されました:', features);
      return [];
    }

    // 正常データをパラメータにマップ
    return features.map((feature) => ({
      id: feature.id.toString(),
    }));
  } catch (err) {
    console.error('generateStaticParamsで例外が発生:', err);
    return [];
  }
}


    return data.map((feature) => ({
      id: feature.id.toString(),
    }));
  } catch (error) {
    console.error('generateStaticParams() error:', error);
    return []; // ネットワークなどの例外時にも空配列
  }
}
export async function fetchArticles() {
  const res = await fetch('https://example.com/api/articles');
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
