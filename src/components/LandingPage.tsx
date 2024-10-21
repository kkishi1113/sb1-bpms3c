import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BrainCircuit, Rocket, Zap } from "lucide-react"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">TaskMaster AI</h1>
        <nav>
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">About</Button>
          <Button>Get Started</Button>
        </nav>
      </header>

      <main className="container mx-auto py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Supercharge Your Productivity with AI</h2>
          <p className="text-xl mb-8">TaskMaster AI learns your work style and helps you accomplish more in less time.</p>
          <Button size="lg" className="mr-4">Start Free Trial</Button>
          <Button size="lg" variant="outline">Watch Demo</Button>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <BrainCircuit className="w-10 h-10 mb-2" />
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Get personalized recommendations and insights to optimize your workflow.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 mb-2" />
                <CardTitle>Smart Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Automate repetitive tasks and focus on what really matters.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Rocket className="w-10 h-10 mb-2" />
                <CardTitle>Seamless Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Works with your favorite tools and platforms out of the box.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">How It Works</h3>
          <Tabs defaultValue="analyze" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analyze">Analyze</TabsTrigger>
              <TabsTrigger value="optimize">Optimize</TabsTrigger>
              <TabsTrigger value="execute">Execute</TabsTrigger>
            </TabsList>
            <TabsContent value="analyze">
              <Card>
                <CardHeader>
                  <CardTitle>Analyze Your Workflow</CardTitle>
                  <CardDescription>TaskMaster AI studies your work patterns and habits.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Our advanced AI algorithms analyze your daily tasks, time spent on different activities, and overall productivity patterns to gain deep insights into your work style.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="optimize">
              <Card>
                <CardHeader>
                  <CardTitle>Optimize Your Process</CardTitle>
                  <CardDescription>Receive personalized recommendations to improve efficiency.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Based on the analysis, TaskMaster AI provides tailored suggestions to optimize your workflow, eliminate bottlenecks, and enhance your productivity.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="execute">
              <Card>
                <CardHeader>
                  <CardTitle>Execute with Precision</CardTitle>
                  <CardDescription>Implement AI-driven strategies and track your progress.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Put the AI-powered insights into action with our suite of productivity tools. Monitor your improvements and adjust your strategies in real-time for maximum efficiency.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-semibold mb-6">Ready to Boost Your Productivity?</h3>
          <Button size="lg">Get Started Now</Button>
        </section>
      </main>

      <footer className="bg-muted py-6 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2023 TaskMaster AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage