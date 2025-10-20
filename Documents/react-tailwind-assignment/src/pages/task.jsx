import Layout from "../components/layout";
import TaskManager from "../components/taskmanager";

export default function Task() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4">
        <TaskManager />
      </div>
    </Layout>
  );
}
