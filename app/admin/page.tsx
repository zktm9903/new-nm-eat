"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Trash2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BoardPost {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/admin/me");
    return res.ok;
  }, []);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/admin/posts");
    if (!res.ok) return;
    const data = await res.json();
    setPosts(data);
  }, []);

  useEffect(() => {
    checkAuth().then((ok) => {
      setIsLoggedIn(ok);
      if (ok) fetchPosts();
    });
  }, [checkAuth, fetchPosts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setLoginError(data?.error ?? "로그인에 실패했습니다.");
        return;
      }
      setIsLoggedIn(true);
      setPassword("");
      fetchPosts();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    setPosts([]);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("이 글을 삭제할까요?")) return;
    const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("삭제에 실패했습니다.");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  if (isLoggedIn === null) {
    return (
      <div className="container max-w-[600px] mx-auto px-4 py-12 flex justify-center">
        <p className="text-muted-foreground">확인 중...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container max-w-[400px] mx-auto px-4 py-12">
        <h1 className="text-xl font-semibold mb-6">관리자 로그인</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">비밀번호</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
            />
          </div>
          {loginError && (
            <p className="text-sm text-destructive">{loginError}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="container max-w-[600px] mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">관리자 · 최신 게시물 20개</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/">메인</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4 mr-1" />
            로그아웃
          </Button>
        </div>
      </div>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Card>
              <CardHeader className="py-3 pb-1 flex flex-row items-center justify-between gap-2">
                <span className="font-medium text-sm">{post.nickname}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(post.createdAt), "yyyy-MM-dd HH:mm")}
                </span>
              </CardHeader>
              <CardContent className="py-2 pt-0 flex items-start justify-between gap-2">
                <p className="text-sm text-muted-foreground flex-1 min-w-0 line-clamp-2">
                  {post.content}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(post.id)}
                  aria-label="삭제"
                >
                  <Trash2 className="size-4" />
                </Button>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      {posts.length === 0 && (
        <p className="text-center text-muted-foreground py-8">게시물이 없습니다.</p>
      )}
    </div>
  );
}
