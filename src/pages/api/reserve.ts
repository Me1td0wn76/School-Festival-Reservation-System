import type { APIRoute } from 'astro';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  people: string;
  menu: string;
  time: string;
  notes?: string;
  createdAt: string;
  status: 'active' | 'cancelled';
}

const RESERVATIONS_FILE = path.join(process.cwd(), 'public', 'reservations.json');

async function getReservations(): Promise<Reservation[]> {
  try {
    const data = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合は空配列を返す
    return [];
  }
}

async function saveReservations(reservations: Reservation[]): Promise<void> {
  try {
    // publicディレクトリが存在しない場合は作成
    const publicDir = path.dirname(RESERVATIONS_FILE);
    await fs.mkdir(publicDir, { recursive: true });
    
    await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
  } catch (error) {
    console.error('予約データの保存に失敗しました:', error);
    throw new Error('予約データの保存に失敗しました');
  }
}

function validateReservation(data: any): string | null {
  if (!data.name || data.name.trim() === '') {
    return 'お名前は必須項目です';
  }
  
  if (!data.phone || data.phone.trim() === '') {
    return '電話番号は必須項目です';
  }
  
  if (!data.people || data.people.trim() === '') {
    return '人数は必須項目です';
  }
  
  if (!data.menu || data.menu.trim() === '') {
    return 'メニューは必須項目です';
  }
  
  if (!data.time || data.time.trim() === '') {
    return '時間帯は必須項目です';
  }
  
  // 電話番号の基本的なバリデーション
  const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
  if (!phoneRegex.test(data.phone)) {
    return '電話番号の形式が正しくありません';
  }
  
  // メールアドレスのバリデーション（入力されている場合のみ）
  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return 'メールアドレスの形式が正しくありません';
    }
  }
  
  return null;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    
    // バリデーション
    const validationError = validateReservation(data);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 新しい予約を作成
    const reservation: Reservation = {
      id: uuidv4(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || '',
      people: data.people,
      menu: data.menu,
      time: data.time,
      notes: data.notes?.trim() || '',
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // 既存の予約を取得
    const reservations = await getReservations();
    
    // 新しい予約を追加
    reservations.push(reservation);
    
    // ファイルに保存
    await saveReservations(reservations);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        reservationId: reservation.id,
        message: '予約が完了しました'
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('予約処理中にエラーが発生しました:', error);
    
    return new Response(
      JSON.stringify({ 
        error: '予約処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
