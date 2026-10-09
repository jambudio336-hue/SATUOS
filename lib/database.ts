import * as SQLite from 'expo-sqlite';

let promise: Promise<SQLite.SQLiteDatabase> | undefined;
export async function db() {
  if (!promise) promise = SQLite.openDatabaseAsync('satuos.db');
  const d = await promise;
  await d.execAsync(`
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS transactions(id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL CHECK(kind IN ('pemasukan','pengeluaran')), title TEXT NOT NULL, amount REAL NOT NULL CHECK(amount>=0), category TEXT NOT NULL DEFAULT 'Umum', wallet_id INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,price REAL NOT NULL DEFAULT 0,cost REAL NOT NULL DEFAULT 0,stock INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,done INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS assets(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,value REAL NOT NULL DEFAULT 0,kind TEXT NOT NULL DEFAULT 'aset');
    CREATE TABLE IF NOT EXISTS drafts(id INTEGER PRIMARY KEY AUTOINCREMENT,platform TEXT NOT NULL,caption TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'Draf',created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS trust_checks(id INTEGER PRIMARY KEY AUTOINCREMENT,target TEXT NOT NULL,verdict TEXT NOT NULL,reasons TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS wallets(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL UNIQUE,opening_balance REAL NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS budgets(id INTEGER PRIMARY KEY AUTOINCREMENT,category TEXT NOT NULL,amount REAL NOT NULL CHECK(amount>=0),month TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS debts(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,amount REAL NOT NULL CHECK(amount>=0),kind TEXT NOT NULL CHECK(kind IN ('utang','piutang')),due_date TEXT,paid INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS contacts(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,kind TEXT NOT NULL CHECK(kind IN ('pelanggan','pemasok')),phone TEXT NOT NULL DEFAULT '',notes TEXT NOT NULL DEFAULT '');
    CREATE TABLE IF NOT EXISTS reminders(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,due_at TEXT NOT NULL,done INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,body TEXT NOT NULL DEFAULT '',kind TEXT NOT NULL DEFAULT 'keluarga',created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS activity_log(id INTEGER PRIMARY KEY AUTOINCREMENT,action TEXT NOT NULL,detail TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS purchases(id INTEGER PRIMARY KEY AUTOINCREMENT,product_id INTEGER NOT NULL,quantity INTEGER NOT NULL CHECK(quantity>0),unit_cost REAL NOT NULL CHECK(unit_cost>=0),created_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS sales(id INTEGER PRIMARY KEY AUTOINCREMENT,product_id INTEGER NOT NULL,product_name TEXT NOT NULL,quantity INTEGER NOT NULL CHECK(quantity>0),unit_price REAL NOT NULL CHECK(unit_price>=0),unit_cost REAL NOT NULL CHECK(unit_cost>=0),created_at TEXT NOT NULL DEFAULT (datetime('now')));
    INSERT OR IGNORE INTO migrations(version,applied_at) VALUES(1,datetime('now'));
  `);
  // Safe additive migration for databases created by the first app version.
  const cols = await d.getAllAsync<{name:string}>('PRAGMA table_info(transactions)');
  if (!cols.some(c => c.name === 'wallet_id')) await d.execAsync('ALTER TABLE transactions ADD COLUMN wallet_id INTEGER');
  await d.execAsync("INSERT OR IGNORE INTO migrations(version,applied_at) VALUES(2,datetime('now'))");
  return d;
}
export type Transaction={id:number;kind:'pemasukan'|'pengeluaran';title:string;amount:number;category:string;wallet_id:number|null;created_at:string};
export type Product={id:number;name:string;price:number;cost:number;stock:number;updated_at:string};
export type Task={id:number;title:string;done:number};
export type Asset={id:number;title:string;value:number;kind:string};
export type Wallet={id:number;name:string;opening_balance:number;balance:number};
export type Budget={id:number;category:string;amount:number;month:string;spent:number};
export type Debt={id:number;title:string;amount:number;kind:'utang'|'piutang';due_date:string|null;paid:number};
export type Contact={id:number;name:string;kind:'pelanggan'|'pemasok';phone:string;notes:string};
export type Reminder={id:number;title:string;due_at:string;done:number};
export type Note={id:number;title:string;body:string;kind:string;created_at:string};

export async function addTransaction(kind:'pemasukan'|'pengeluaran',title:string,amount:number,category='Umum',walletId:number|null=null) {
  if (!title.trim() || !Number.isFinite(amount) || amount < 0) throw Error('Isi keterangan dan nominal yang valid.');
  const d=await db();
  await d.withTransactionAsync(async()=>{
    await d.runAsync('INSERT INTO transactions(kind,title,amount,category,wallet_id) VALUES(?,?,?,?,?)',kind,title.trim(),amount,category,walletId);
    await d.runAsync('INSERT INTO activity_log(action,detail) VALUES(?,?)','Transaksi ditambahkan',kind+': '+title.trim());
  });
}
export async function listTransactions():Promise<Transaction[]>{return(await db()).getAllAsync<Transaction>('SELECT * FROM transactions ORDER BY id DESC LIMIT 500')}
export async function deleteTransaction(id:number){const d=await db();await d.runAsync('DELETE FROM transactions WHERE id=?',id)}
export async function summary(){const r=await(await db()).getFirstAsync<{income:number;expense:number}>("SELECT COALESCE(SUM(CASE WHEN kind='pemasukan' THEN amount ELSE 0 END),0) income,COALESCE(SUM(CASE WHEN kind='pengeluaran' THEN amount ELSE 0 END),0) expense FROM transactions");return{income:r?.income??0,expense:r?.expense??0,balance:(r?.income??0)-(r?.expense??0)}}
export async function addProduct(name:string,price:number,cost:number,stock:number){if(!name.trim()||![price,cost,stock].every(Number.isFinite)||price<0||cost<0||stock<0)throw Error('Data produk tidak valid.');await(await db()).runAsync('INSERT INTO products(name,price,cost,stock) VALUES(?,?,?,?)',name.trim(),price,cost,Math.floor(stock))}
export async function listProducts():Promise<Product[]>{return(await db()).getAllAsync<Product>('SELECT * FROM products ORDER BY name COLLATE NOCASE')}
export async function sellOne(id:number){const d=await db();await d.withTransactionAsync(async()=>{const p=await d.getFirstAsync<Product>('SELECT * FROM products WHERE id=?',id);if(!p)throw Error('Produk tidak ditemukan.');if(p.stock<1)throw Error('Stok tidak mencukupi.');await d.runAsync('UPDATE products SET stock=stock-1,updated_at=datetime(\'now\') WHERE id=?',id);await d.runAsync("INSERT INTO transactions(kind,title,amount,category) VALUES('pemasukan',?,?,?)",'Penjualan: '+p.name,p.price,'Penjualan');await d.runAsync('INSERT INTO sales(product_id,product_name,quantity,unit_price,unit_cost) VALUES(?,?,1,?,?)',p.id,p.name,p.price,p.cost);await d.runAsync('INSERT INTO activity_log(action,detail) VALUES(?,?)','Penjualan dicatat',p.name+' · '+p.price)})}
export async function purchaseStock(id:number,quantity:number,unitCost:number){if(!Number.isInteger(quantity)||quantity<1||!Number.isFinite(unitCost)||unitCost<0)throw Error('Jumlah pembelian atau modal tidak valid.');const d=await db();await d.withTransactionAsync(async()=>{const p=await d.getFirstAsync<Product>('SELECT * FROM products WHERE id=?',id);if(!p)throw Error('Produk tidak ditemukan.');await d.runAsync('UPDATE products SET stock=stock+?,cost=?,updated_at=datetime(\'now\') WHERE id=?',quantity,unitCost,id);await d.runAsync('INSERT INTO purchases(product_id,quantity,unit_cost) VALUES(?,?,?)',id,quantity,unitCost);await d.runAsync("INSERT INTO transactions(kind,title,amount,category) VALUES('pengeluaran',?,?,?)",'Pembelian stok: '+p.name,quantity*unitCost,'Pembelian stok')})}
export async function addTask(title:string){if(!title.trim())throw Error('Nama tugas wajib diisi.');await(await db()).runAsync('INSERT INTO tasks(title) VALUES(?)',title.trim())}
export async function listTasks():Promise<Task[]>{return(await db()).getAllAsync<Task>('SELECT * FROM tasks ORDER BY done,id DESC')}
export async function toggleTask(id:number,done:boolean){await(await db()).runAsync('UPDATE tasks SET done=? WHERE id=?',done?1:0,id)}
export async function addAsset(title:string,value:number,kind='aset'){if(!title.trim()||!Number.isFinite(value)||value<0)throw Error('Data aset tidak valid.');await(await db()).runAsync('INSERT INTO assets(title,value,kind) VALUES(?,?,?)',title.trim(),value,kind)}
export async function listAssets():Promise<Asset[]>{return(await db()).getAllAsync<Asset>('SELECT * FROM assets ORDER BY rowid DESC')}
export async function addDraft(platform:string,caption:string){if(!caption.trim())throw Error('Caption wajib diisi.');await(await db()).runAsync('INSERT INTO drafts(platform,caption) VALUES(?,?)',platform,caption.trim())}
export async function listDrafts(){return(await db()).getAllAsync<{id:number;platform:string;caption:string;status:string}>('SELECT * FROM drafts ORDER BY id DESC')}
export async function addCheck(target:string,verdict:string,reasons:string){await(await db()).runAsync('INSERT INTO trust_checks(target,verdict,reasons) VALUES(?,?,?)',target,verdict,reasons)}
export async function listChecks(){return(await db()).getAllAsync<{id:number;target:string;verdict:string;reasons:string}>('SELECT * FROM trust_checks ORDER BY id DESC LIMIT 50')}
export async function addWallet(name:string,openingBalance:number){if(!name.trim()||!Number.isFinite(openingBalance))throw Error('Nama dompet dan saldo awal wajib valid.');await(await db()).runAsync('INSERT INTO wallets(name,opening_balance) VALUES(?,?)',name.trim(),openingBalance)}
export async function listWallets():Promise<Wallet[]>{return(await db()).getAllAsync<Wallet>("SELECT w.id,w.name,w.opening_balance,w.opening_balance+COALESCE(SUM(CASE WHEN t.kind='pemasukan' THEN t.amount WHEN t.kind='pengeluaran' THEN -t.amount ELSE 0 END),0) balance FROM wallets w LEFT JOIN transactions t ON t.wallet_id=w.id GROUP BY w.id ORDER BY w.id")}
export async function addBudget(category:string,amount:number,month:string){if(!category.trim()||!Number.isFinite(amount)||amount<0||!/^\d{4}-\d{2}$/.test(month))throw Error('Data anggaran tidak valid.');await(await db()).runAsync('INSERT INTO budgets(category,amount,month) VALUES(?,?,?)',category.trim(),amount,month)}
export async function listBudgets(month:string):Promise<Budget[]>{return(await db()).getAllAsync<Budget>("SELECT b.*,COALESCE((SELECT SUM(t.amount) FROM transactions t WHERE t.kind='pengeluaran' AND t.category=b.category AND substr(t.created_at,1,7)=b.month),0) spent FROM budgets b WHERE b.month=? ORDER BY b.category",month)}
export async function addDebt(title:string,amount:number,kind:'utang'|'piutang',dueDate=''){if(!title.trim()||!Number.isFinite(amount)||amount<0)throw Error('Data utang/piutang tidak valid.');await(await db()).runAsync('INSERT INTO debts(title,amount,kind,due_date) VALUES(?,?,?,?)',title.trim(),amount,kind,dueDate||null)}
export async function listDebts():Promise<Debt[]>{return(await db()).getAllAsync<Debt>('SELECT * FROM debts ORDER BY paid,due_date')}
export async function settleDebt(id:number){await(await db()).runAsync('UPDATE debts SET paid=1 WHERE id=?',id)}
export async function addContact(name:string,kind:'pelanggan'|'pemasok',phone='',notes=''){if(!name.trim())throw Error('Nama kontak wajib diisi.');await(await db()).runAsync('INSERT INTO contacts(name,kind,phone,notes) VALUES(?,?,?,?)',name.trim(),kind,phone.trim(),notes.trim())}
export async function listContacts(kind:'pelanggan'|'pemasok'):Promise<Contact[]>{return(await db()).getAllAsync<Contact>('SELECT * FROM contacts WHERE kind=? ORDER BY name COLLATE NOCASE',kind)}
export async function addReminder(title:string,dueAt:string){if(!title.trim()||!dueAt.trim())throw Error('Judul dan tanggal pengingat wajib diisi.');await(await db()).runAsync('INSERT INTO reminders(title,due_at) VALUES(?,?)',title.trim(),dueAt.trim())}
export async function listReminders():Promise<Reminder[]>{return(await db()).getAllAsync<Reminder>('SELECT * FROM reminders ORDER BY done,due_at')}
export async function addNote(title:string,body:string,kind='keluarga'){if(!title.trim())throw Error('Judul catatan wajib diisi.');await(await db()).runAsync('INSERT INTO notes(title,body,kind) VALUES(?,?,?)',title.trim(),body,kind)}
export async function listNotes():Promise<Note[]>{return(await db()).getAllAsync<Note>('SELECT * FROM notes ORDER BY id DESC')}
export async function wealthSummary(){const d=await db();const a=await d.getFirstAsync<{n:number}>('SELECT COALESCE(SUM(value),0) n FROM assets');const debts=await d.getFirstAsync<{n:number}>('SELECT COALESCE(SUM(amount),0) n FROM debts WHERE paid=0 AND kind=\'utang\'');const receivable=await d.getFirstAsync<{n:number}>('SELECT COALESCE(SUM(amount),0) n FROM debts WHERE paid=0 AND kind=\'piutang\'');return{assets:a?.n??0,liabilities:debts?.n??0,receivables:receivable?.n??0,net:(a?.n??0)+(receivable?.n??0)-(debts?.n??0)}}
export async function exportData(){const d=await db();const names=['transactions','products','tasks','assets','drafts','trust_checks','wallets','budgets','debts','contacts','reminders','notes','purchases','sales','activity_log'];const tables:Record<string,any[]>={};for(const n of names)tables[n]=await d.getAllAsync('SELECT * FROM '+n);return JSON.stringify({format:'SATUOS-CADANGAN',version:2,exportedAt:new Date().toISOString(),tables},null,2)}
const allowedTables=['transactions','products','tasks','assets','drafts','trust_checks','wallets','budgets','debts','contacts','reminders','notes','purchases','sales','activity_log'] as const;
export async function restoreData(json:string){let parsed:any;try{parsed=JSON.parse(json)}catch{throw Error('Berkas cadangan bukan JSON yang valid.')}if(parsed?.format!=='SATUOS-CADANGAN')throw Error('Format cadangan SATUOS tidak dikenali.');
  if(!parsed.tables&&parsed.version===1){parsed.tables={transactions:parsed.transactions||[],products:parsed.products||[],tasks:parsed.tasks||[],assets:parsed.assets||[],drafts:parsed.drafts||[],trust_checks:parsed.checks||[]};}
  if(!parsed.tables||typeof parsed.tables!=='object')throw Error('Cadangan tidak memiliki tabel data.');
  for(const name of allowedTables){if(parsed.tables[name]!==undefined&&!Array.isArray(parsed.tables[name]))throw Error('Data tabel '+name+' tidak valid.');}
  const names=allowedTables.filter(name=>Array.isArray(parsed.tables[name]));
  if(!names.length)throw Error('Cadangan tidak berisi tabel yang dapat dipulihkan.');
  const d=await db();await d.withTransactionAsync(async()=>{for(const name of names){const rows=parsed.tables[name];if(rows.length>100000)throw Error('Cadangan terlalu besar.');await d.runAsync('DELETE FROM '+name);for(const row of rows){if(!row||typeof row!=='object'||Array.isArray(row))throw Error('Baris pada tabel '+name+' tidak valid.');const keys=Object.keys(row).filter(k=>/^[a-z_]+$/.test(k));if(!keys.length)continue;const sql='INSERT INTO '+name+'('+keys.join(',')+') VALUES('+keys.map(()=>'?').join(',')+')';await d.runAsync(sql,...keys.map(k=>row[k]??null));}}});}
export async function businessSummary(){const d=await db();const r=await d.getFirstAsync<{revenue:number;soldCost:number;purchases:number;units:number;lowStock:number}>('SELECT COALESCE((SELECT SUM(unit_price*quantity) FROM sales),0) revenue,COALESCE((SELECT SUM(unit_cost*quantity) FROM sales),0) soldCost,COALESCE((SELECT SUM(quantity*unit_cost) FROM purchases),0) purchases,COALESCE((SELECT SUM(quantity) FROM sales),0) units,COALESCE((SELECT COUNT(*) FROM products WHERE stock<=3),0) lowStock FROM products');return{revenue:r?.revenue??0,soldCost:r?.soldCost??0,purchases:r?.purchases??0,units:r?.units??0,lowStock:r?.lowStock??0,grossProfit:(r?.revenue??0)-(r?.soldCost??0)}}
export async function exportCsvTransactions(){const rows=await listTransactions();const esc=(v:unknown)=>'"'+String(v??'').replace(/"/g,'""')+'"';return '\uFEFF'+[['ID','Jenis','Keterangan','Nominal','Kategori','Tanggal'],...rows.map(r=>[r.id,r.kind,r.title,r.amount,r.category,r.created_at])].map(row=>row.map(esc).join(';')).join('\r\n')}
