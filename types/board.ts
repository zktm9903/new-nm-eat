export interface BoardPost {
  id: string;
  nickname: string;
  content: string;
  createdAt: Date;
  /** 현재 로그인 사용자가 작성한 글인지 (본인 글 삭제 버튼 표시용) */
  isMine?: boolean;
}
