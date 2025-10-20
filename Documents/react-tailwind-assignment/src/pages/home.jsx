import Layout from "../components/layout";
import Todos from "../components/todos";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <h1 className="text-3xl font-bold mb-2">Home Page</h1>
        <p>Welcome to your React + Tailwind app!</p>

        <h2 className="text-2xl font-bold mt-6 mb-4">Sample Todos from API</h2>
        <Todos />
      </div>
    </Layout>
  );
}
