import { useParams } from "next/navigation";

export default async function Project() {
  const router = useParams();
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/" + 1);
  const todo: Todo = await response.json();

  return (
    <main>
      <h1>Project page</h1>
      <div>{todo.title}</div>
      {JSON.stringify(router)}
    </main>
  );
}

type Todo = {
  title: string;
};
