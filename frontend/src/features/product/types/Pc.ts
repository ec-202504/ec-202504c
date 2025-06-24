export type Pc = {
  pcId: number;
  name: string;
  imageUrl: string;
  price: number;
  memory: number;
  storage: number;
  deviceSize: number;
  deviceType: number;
  os: string;
  cpu: string;
  gpu: string;
  purpose: string;
};

export type RawPc = {
  pc: {
    id: number;
    name: string;
    price: number;
    memory: number;
    storage: number;
    deviceSize: number;
    deviceType: number;
    os: { id: number; name: string };
    cpu: { id: number; name: string };
    gpu: { id: number; name: string };
    purpose: { id: number; name: string; productCategory: number };
    // 他のプロパティがあっても問題なし
  };
};
