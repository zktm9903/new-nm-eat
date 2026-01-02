import { readFileSync } from 'fs';
import { join } from 'path';
import { supabase } from '../lib/supabase/server';

async function migrate() {
  try {
    const sql = readFileSync(
      join(__dirname, '../lib/supabase/migrations/001_create_menus_table.sql'),
      'utf-8',
    );

    // SQL을 세미콜론으로 분리하여 각각 실행
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', {
          sql: statement,
        });

        // RPC가 없으면 직접 쿼리 실행 시도
        if (error) {
          console.log('Trying alternative method...');
          // Supabase는 직접 SQL 실행을 지원하지 않으므로
          // 사용자에게 Supabase 대시보드에서 실행하도록 안내
          console.error(
            'Please run the SQL migration manually in Supabase dashboard.',
          );
          console.error('SQL file location:', __dirname);
          return;
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    console.log(
      '\nPlease run the SQL migration manually in Supabase dashboard:',
    );
    console.log(
      'File: lib/supabase/migrations/001_create_menus_table.sql',
    );
  }
}

migrate();

