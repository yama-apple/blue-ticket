import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { getVersion } from '../data'

export function DataInfoScreen() {
  const version = getVersion()

  return (
    <div className="pb-20">
      <Header title="データ更新情報" showBack />

      <div className="px-4 pt-4">
        <Card className="mb-4">
          <div className="text-center mb-3">
            <span className="text-4xl">📋</span>
            <div className="text-lg font-bold text-gray-900 mt-2">
              v{version.data_version}
            </div>
            <div className="text-xs text-gray-500">
              最終更新: {version.last_updated}
            </div>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="mb-2">{version.source}</p>
          </div>
        </Card>

        <h3 className="text-sm font-bold text-gray-700 mb-2">更新履歴</h3>
        <div className="space-y-2">
          {version.change_log.map((log, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{log.date}</div>
                  <div className="text-sm text-gray-700">{log.description}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-4" variant="warning">
          <p className="text-xs text-gray-600 leading-relaxed">
            {version.disclaimer}
          </p>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            データは JSON 形式で管理されており、
            <br />制度改正時にアプリの更新なしでデータのみ差し替え可能です。
          </p>
        </div>
      </div>
    </div>
  )
}
