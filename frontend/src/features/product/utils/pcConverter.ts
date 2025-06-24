import type { Pc, RawPc } from "../types/Pc";

export const convertToPc = (raw: RawPc): Pc => {
  return {
    pcId: raw.pc.id,
    name: raw.pc.name,
    imageUrl: "", // 画像URLは未提供なので空文字かダミーURLに
    price: raw.pc.price,
    memory: raw.pc.memory,
    storage: raw.pc.storage,
    deviceSize: raw.pc.deviceSize,
    deviceType: raw.pc.deviceType,
    os: raw.pc.os.name,
    cpu: raw.pc.cpu.name,
    gpu: raw.pc.gpu.name,
    purpose: raw.pc.purpose.name,
  };
};
