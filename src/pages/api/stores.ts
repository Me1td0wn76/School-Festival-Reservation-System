import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import * as path from 'path';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const storeId = url.searchParams.get('storeId');
    
    const storesPath = path.join(process.cwd(), 'public', 'stores.json');
    const storesData = await fs.readFile(storesPath, 'utf-8');
    const stores = JSON.parse(storesData);
    
    if (storeId) {
      // 特定の店舗情報を取得
      const store = stores.stores.find((s: any) => s.id === storeId);
      if (!store) {
        return new Response(JSON.stringify({ error: '店舗が見つかりません' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return new Response(JSON.stringify({ store }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // 全店舗一覧を取得
      const activeStores = stores.stores.filter((s: any) => s.active);
      return new Response(JSON.stringify({ stores: activeStores }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('店舗データ取得エラー:', error);
    return new Response(JSON.stringify({ error: '店舗データの取得に失敗しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
