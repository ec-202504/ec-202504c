export type RawPc = {
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
  purpose: { id: number; name: string };
};
