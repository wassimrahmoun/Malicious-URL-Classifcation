import { UrlClassifier } from "@/components/url-classifier"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">URL Security Classifier</h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              Check if a URL is malicious or safe with our advanced classification model
            </p>
          </div>
          <UrlClassifier />
        </div>
      </div>
    </div>
  )
}
