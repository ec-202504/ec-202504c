type PcSpec = {
  os: string;
  cpu: string;
  gpu: string;
  memory: number;
  storage: number;
  deviceSize: number;
  deviceType: number;
};

type PcSpecListProps = {
  pc: PcSpec;
};

export default function PcSpecList({ pc }: PcSpecListProps) {
  return (
    <ul className="text-base mb-2">
      <li className="flex">
        <div className="w-[80px] font-bold">OS：</div>
        {pc.os}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">CPU：</div>
        {pc.cpu}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">GPU：</div>
        {pc.gpu}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">メモリ：</div>
        {pc.memory}GB
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">ストレージ：</div>
        {pc.storage >= 1024
          ? `${(pc.storage / 1024).toFixed(1)}TB`
          : `${pc.storage}GB`}
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">サイズ：</div>
        {pc.deviceType === 0 ? (
          <span className="text-gray-500">-</span>
        ) : (
          `${pc.deviceSize}インチ`
        )}
      </li>
    </ul>
  );
}
