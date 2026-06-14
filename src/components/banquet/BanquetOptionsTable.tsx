import { BANQUET_OPTIONS } from '@/data/banquet-options';

export default function BanquetOptionsTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface-2">
      <table className="w-full text-left">
        <caption className="sr-only">단체 옵션 및 부대 가격표</caption>
        <thead>
          <tr className="border-b border-border bg-surface-3">
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-fg">
              항목
            </th>
            <th scope="col" className="px-4 py-3 text-sm font-semibold text-fg">
              구성·단위
            </th>
            <th scope="col" className="px-4 py-3 text-right text-sm font-semibold text-fg">
              가격
            </th>
          </tr>
        </thead>
        <tbody>
          {BANQUET_OPTIONS.map((option) => (
            <tr key={option.id} className="border-b border-border last:border-b-0">
              <td className="px-4 py-3 text-fg font-medium">{option.label}</td>
              <td className="px-4 py-3 text-fg-soft text-sm">
                {option.detail ?? <span className="text-fg-muted">—</span>}
              </td>
              <td className="px-4 py-3 text-right text-fg font-semibold whitespace-nowrap">
                {option.priceWon.toLocaleString('ko-KR')}원
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
