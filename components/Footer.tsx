import Image from "next/image";

function Footer() {
  return (
    <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
      <a
        href="https://github.com/quinn-dougherty/rallypoint"
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        <Image src="/github.png" alt="GitHub" height="30" width="30" />
      </a>
    </footer>
  );
}

export default Footer;
