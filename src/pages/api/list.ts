import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import * as path from 'path';
import type { Reservation } from './reserve';

const RESERVATIONS_FILE = path.join(process.cwd(), 'public', 'reservations.json');
// 環境変数からパスワードを取得、デフォルトは開発用
const STAFF_PASSWORD = process.env.STAFF_PASSWORD || 'school2024';

async function getReservations(): Promise<Reservation[]> {
  try {
    const data = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合は空配列を返す
    return [];
  }
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    
    // パスワード認証
    if (password !== STAFF_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'アクセスが拒否されました' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const reservations = await getReservations();
    
    // 予約を日時順でソート（新しいものから）
    const sortedReservations = reservations.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // 統計情報を計算
    const stats = {
      total: reservations.length,
      active: reservations.filter(r => r.status === 'active').length,
      cancelled: reservations.filter(r => r.status === 'cancelled').length,
      byMenu: reservations.reduce((acc, r) => {
        acc[r.menu] = (acc[r.menu] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byTime: reservations.reduce((acc, r) => {
        acc[r.time] = (acc[r.time] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    return new Response(
      JSON.stringify({ 
        reservations: sortedReservations,
        stats
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('予約一覧取得中にエラーが発生しました:', error);
    
    return new Response(
      JSON.stringify({ 
        error: '予約一覧の取得に失敗しました'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { action, reservationId, password } = await request.json();
    
    // パスワード認証
    if (password !== STAFF_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'アクセスが拒否されました' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (action === 'cancel' && reservationId) {
      const reservations = await getReservations();
      const reservationIndex = reservations.findIndex(r => r.id === reservationId);
      
      if (reservationIndex === -1) {
        return new Response(
          JSON.stringify({ error: '予約が見つかりません' }),
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      reservations[reservationIndex].status = 'cancelled';
      
      // ファイルに保存
      const publicDir = path.dirname(RESERVATIONS_FILE);
      await fs.mkdir(publicDir, { recursive: true });
      await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));
      
      return new Response(
        JSON.stringify({ success: true, message: '予約をキャンセルしました' }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: '不正なアクションです' }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('予約操作中にエラーが発生しました:', error);
    
    return new Response(
      JSON.stringify({ 
        error: '操作に失敗しました'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
