import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // ユーザーのインタラクションを必要とするため、ボタンクリックイベントハンドラー内で実行
      const userCredential = await signInWithGoogle();
      if (userCredential) {
        toast({
          title: 'ログイン成功',
          description: 'ダッシュボードにリダイレクトします',
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: 'エラー',
        description: error.message || 'ログインに失敗しました',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>Googleアカウントでログインしてください</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full" variant="outline">
            <Chrome className="mr-2 h-4 w-4" />
            {loading ? 'ログイン中...' : 'Googleでログイン'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
