import { rupiah, nominal } from '../lib/format';

describe('format Rupiah dan nominal', () => {
  test('memformat nominal sebagai Rupiah Indonesia', () => {
    expect(rupiah(100000)).toContain('100.000');
    expect(rupiah(0)).toContain('0');
  });

  test('membaca angka dengan format Indonesia', () => {
    expect(nominal('1.234,50')).toBe(1234.5);
    expect(nominal('Rp 100.000')).toBe(100000);
  });

  test('menolak nominal negatif dan input bukan angka', () => {
    expect(() => nominal('-100')).toThrow();
    expect(() => nominal('abc')).toThrow();
  });
});
