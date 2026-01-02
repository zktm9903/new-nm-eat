import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUserToken } from '@/lib/auth/token';
import { supabase } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_NAME = process.env.COOKIE_NAME || 'session';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ menuId: string }> }
) {
  try {
    const { menuId } = await params;
    
    // API Route에서는 쿠키를 직접 확인하고 설정
    let userToken = request.cookies.get(COOKIE_NAME)?.value;
    
    if (!userToken) {
      // 쿠키가 없으면 새로 생성
      userToken = uuidv4();
    }
    
    const response = NextResponse.json({ success: true });
    
    // 쿠키가 없었으면 응답에 쿠키 설정
    if (!request.cookies.get(COOKIE_NAME)?.value) {
      response.cookies.set(COOKIE_NAME, userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1년
        path: '/',
      });
    }

    // 사용자 확인 또는 생성
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userToken)
      .single();

    if (userError || !user) {
      // 사용자가 없으면 생성
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ id: userToken })
        .select()
        .single();

      if (createError || !newUser) {
        throw new Error(`Failed to create user: ${createError?.message || 'Unknown error'}`);
      }
      user = newUser;
    }

    // user가 확실히 존재하는지 확인
    if (!user) {
      throw new Error('User not found or created');
    }

    // user_menus 확인
    let { data: userMenu, error: userMenuError } = await supabase
      .from('user_menus')
      .select('*')
      .eq('user_id', user.id)
      .eq('menu_id', menuId)
      .single();

    if (userMenuError && userMenuError.code !== 'PGRST116') {
      throw new Error(`Failed to check user menu: ${userMenuError.message}`);
    }

    // 현재 메뉴의 좋아요 개수 가져오기
    const { data: currentMenu } = await supabase
      .from('menus')
      .select('liked')
      .eq('id', menuId)
      .single();

    if (!currentMenu) {
      throw new Error('Menu not found');
    }

    const currentLikeCount = currentMenu.liked || 0;

    if (userMenu) {
      // 이미 좋아요를 눌렀으면 토글 (여러 개 좋아요 가능하므로 토글)
      const newLiked = !userMenu.liked;
      
      const { error: updateError } = await supabase
        .from('user_menus')
        .update({ liked: newLiked })
        .eq('id', userMenu.id);

      if (updateError) {
        throw new Error(`Failed to update like: ${updateError.message}`);
      }

      // menus 테이블의 liked 컬럼 업데이트
      const newLikeCount = newLiked
        ? currentLikeCount + 1
        : Math.max(0, currentLikeCount - 1);

      const { error: menuUpdateError } = await supabase
        .from('menus')
        .update({ liked: newLikeCount })
        .eq('id', menuId);

      if (menuUpdateError) {
        throw new Error(`Failed to update menu like count: ${menuUpdateError.message}`);
      }
    } else {
      // 새로 좋아요 생성
      const { error: insertError } = await supabase
        .from('user_menus')
        .insert({
          user_id: user.id,
          menu_id: menuId,
          liked: true,
        });

      if (insertError) {
        throw new Error(`Failed to insert like: ${insertError.message}`);
      }

      // menus 테이블의 liked 컬럼 업데이트
      const { error: menuUpdateError } = await supabase
        .from('menus')
        .update({ liked: currentLikeCount + 1 })
        .eq('id', menuId);

      if (menuUpdateError) {
        throw new Error(`Failed to update menu like count: ${menuUpdateError.message}`);
      }
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

