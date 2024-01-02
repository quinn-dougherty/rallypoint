import Header from "@/components/Header";
import Posts from "@/components/Posts";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />
      <Posts lw_username={null} />
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>footer</p>
      </footer>
    </div>
  );
}
