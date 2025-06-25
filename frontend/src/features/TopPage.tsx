import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Monitor,
  Star,
  Users,
  Shield,
  TrendingUp,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { TAB_VALUES } from "./product/types";

function TopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-4 h-4 mr-2" />
              エンジニア特化ECサイト
            </Badge>

            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tech Mate
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              初心者に寄り添い、これから成長する人を応援する
              <br className="hidden sm:block" />
              エンジニアのための商品選び
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/product" search={{ tab: TAB_VALUES.PC }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Monitor className="w-5 h-5 mr-2" />
                  PCを探す
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to="/product" search={{ tab: TAB_VALUES.BOOK }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  技術書を探す
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              なぜTech Mateなのか？
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              エンジニアの視点で厳選された商品と、信頼できる情報をお届けします
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">信頼できる情報</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  エンジニアによる購入者限定レビューで、実践的な評価をお届け。専門用語も分かりやすく解説します。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-xl">目的別おすすめ</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  あなたのレベルと目的に合わせて、最適な商品を提案。ロードマップで成長をサポートします。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl">エンジニア特化</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  プログラミング・開発に特化した商品ラインナップ。初心者から上級者まで対応します。
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              こんな方におすすめ
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                  🎓 情報系学部に進学予定の高校生
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-blue-800 dark:text-blue-200">
                  <p>• 大学の授業や開発学習に必要なPCが知りたい</p>
                  <p>• プログラミングに必要なスペックが分からない</p>
                  <p>• コスパ重視で長く使える一台を探している</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardHeader>
                <CardTitle className="text-xl text-green-900 dark:text-green-100">
                  👩‍💻 新卒1-2年目のエンジニア
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-green-800 dark:text-green-200">
                  <p>• 業務で必要な技術書を効率的に選びたい</p>
                  <p>• 自分のレベルに合った学習ロードマップが欲しい</p>
                  <p>• 実務に直結する知識を得たい</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            今すぐ始めよう
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            あなたに最適な商品を見つけて、
            <br />
            エンジニアとしての成長を加速させましょう
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/product" search={{ tab: TAB_VALUES.PC }}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Monitor className="w-5 h-5 mr-2" />
                PCを探す
              </Button>
            </Link>

            <Link to="/product" search={{ tab: TAB_VALUES.BOOK }}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                技術書を探す
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TopPage;
