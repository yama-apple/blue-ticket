import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { getVersion } from '../data'

export function LegalScreen() {
  const version = getVersion()

  return (
    <div className="pb-20">
      <Header title="法的注意事項" showBack />

      <div className="px-4 pt-4 space-y-4">
        <Card variant="warning">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">⚠️</span>
            <span className="text-sm font-bold text-warning-500">重要なお知らせ</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            本アプリは自転車の交通ルールに関する<strong>学習用アプリ</strong>です。
            法的助言を提供するものではありません。
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">免責事項</h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              本アプリに掲載されている情報は、警察庁等の公開情報を基に作成した学習用コンテンツです。
              実際の取り締まりや処分の判断は、個別の状況により異なります。
            </p>
            <p>
              本アプリの利用により生じた損害について、開発者は一切の責任を負いません。
              最終的には、必ず公式情報（警察庁・各都道府県警察のウェブサイト等）をご確認ください。
            </p>
            <p>
              交通法規は改正される場合があります。本アプリのデータが最新でない可能性があります。
              現在のデータバージョン: <strong>v{version.data_version}</strong>（{version.last_updated} 時点）
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">学習コンテンツについて</h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              本アプリのクイズ・シナリオは、交通ルールの理解を深めるための教材です。
              個別の取り締まり結果を保証するものではありません。
            </p>
            <p>
              反則金額等の情報は、制度施行時点の公開情報に基づいています。
              年度や制度改正により変更される可能性があります。
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">公式情報の参照先</h3>
          <div className="text-sm text-gray-600 leading-relaxed space-y-2">
            <p>・警察庁ウェブサイト</p>
            <p>・各都道府県警察のウェブサイト</p>
            <p>・道路交通法及び関連法令</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">データの出典</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {version.source}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            {version.disclaimer}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">プライバシー</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            本アプリはすべてのデータをお使いの端末内（ローカルストレージ）に保存します。
            サーバーへのデータ送信は行いません。
            学習進捗はブラウザのデータを消去すると失われます。
          </p>
        </Card>
      </div>
    </div>
  )
}
