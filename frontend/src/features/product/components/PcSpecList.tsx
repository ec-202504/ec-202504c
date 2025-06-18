interface PcSpec {
  os: string;
  cpu: string;
  gpu: string;
  memory: number;
  storage: number;
  device_size: number;
}

interface PcSpecListProps {
  pc: PcSpec;
}

export const PcSpecList = ({ pc }: PcSpecListProps) => {
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
        {pc.storage}GB
      </li>
      <li className="flex">
        <div className="w-[80px] font-bold">サイズ：</div>
        {pc.device_size}インチ
      </li>
    </ul>
  );
};
