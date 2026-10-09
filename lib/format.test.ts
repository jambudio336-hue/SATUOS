import {nominal,rupiah} from './format';
describe('format angka SATUOS',()=>{
  test('membaca nominal rupiah tanpa pemisah',()=>{expect(nominal('25000')).toBe(25000)});
  test('membaca pemisah ribuan Indonesia',()=>{expect(nominal('25.000')).toBe(25000)});
  test('menolak nominal negatif',()=>{expect(()=>nominal('-100')).toThrow()});
  test('memformat mata uang Indonesia',()=>{expect(rupiah(100000)).toContain('100.000')});
});
