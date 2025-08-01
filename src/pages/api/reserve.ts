import type { APIRoute } from 'astro';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import * as path from 'path';

interface Reservation {
  id: string;
  name: string;
  people: string;
  storeId: string;
  storeName: string;
  menuId: string;
  menuName: string;
  menuPrice: number;
  timeSlot: string;
  notes: string;
  createdAt: string;
  status: 'active' | 'cancelled';
}

interface Store {
  id: string;
  name: string;
  menus: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  timeSlots: string[];
}

const RESERVATIONS_FILE = path.join(process.cwd(), 'public', 'reservations.json');
const STORES_FILE = path.join(process.cwd(), 'public', 'stores.json');

async function getReservations(): Promise<Reservation[]> {
  try {
    const data = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveReservations(reservations: Reservation[]): Promise<void> {
  try {
    const publicDir = path.dirname(RESERVATIONS_FILE);
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
  } catch (error) {
    console.error('予約データの保存に失敗しました:', error);
    throw new Error('予約データの保存に失敗しました');
  }
}

async function getStoreData(): Promise<{ stores: Store[] }> {
  try {
    const data = await fs.readFile(STORES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('店舗データの読み込みに失敗しました');
  }
}

function validateReservation(reservation: Partial<Reservation>): string[] {
  const errors: string[] = [];

  if (!reservation.name || reservation.name.trim() === '') {
    errors.push('お名前を入力してください');
  }

  if (!reservation.people || reservation.people.trim() === '') {
    errors.push('人数を選択してください');
  }

  if (!reservation.storeId || reservation.storeId.trim() === '') {
    errors.push('店舗を選択してください');
  }

  if (!reservation.menuId || reservation.menuId.trim() === '') {
    errors.push('メニューを選択してください');
  }

  if (!reservation.timeSlot || reservation.timeSlot.trim() === '') {
    errors.push('時間帯を選択してください');
  }

  return errors;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name')?.toString() || '';
    const people = formData.get('people')?.toString() || '';
    const storeId = formData.get('storeId')?.toString() || '';
    const menuId = formData.get('menuId')?.toString() || '';
    const timeSlot = formData.get('timeSlot')?.toString() || '';
    const notes = formData.get('notes')?.toString() || '';

    // 店舗とメニュー情報を取得
    const storeData = await getStoreData();
    const store = storeData.stores.find(s => s.id === storeId);
    
    if (!store) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '選択された店舗が見つかりません' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const menu = store.menus.find(m => m.id === menuId);
    if (!menu) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '選択されたメニューが見つかりません' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // バリデーション
    const reservationData: Partial<Reservation> = {
      name, people, storeId, menuId, timeSlot, notes
    };

    const validationErrors = validateReservation(reservationData);
    if (validationErrors.length > 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: validationErrors.join('、') 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 新しい予約を作成
    const newReservation: Reservation = {
      id: uuidv4(),
      name,
      people,
      storeId,
      storeName: store.name,
      menuId,
      menuName: menu.name,
      menuPrice: menu.price,
      timeSlot,
      notes,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // 既存の予約を取得して新しい予約を追加
    const reservations = await getReservations();
    reservations.push(newReservation);

    // ファイルに保存
    await saveReservations(reservations);

    return new Response(JSON.stringify({ 
      success: true, 
      reservationId: newReservation.id,
      storeName: store.name,
      menuName: menu.name,
      menuPrice: menu.price,
      timeSlot: timeSlot
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('予約処理エラー:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: '予約の処理中にエラーが発生しました' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
