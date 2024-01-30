import CaptionFadeImage from "@/components/CaptionFadeImage";
import AllPostsList from "@/components/posts/AllPostsList";

interface FeatureItem {
  title: string;
  img: string;
  description: string;
}

function Feature({ title, img, description }: FeatureItem) {
  return (
    <div className="">
      <div className="">
        <h3 className="title">{title}</h3>
        <CaptionFadeImage src={img} alt={title} caption={description} />
      </div>
    </div>
  );
}

const featureList = [
  {
    title: "Lean and quick funding",
    img: "/logo5.png",
    description: "Find people to execute your ideas with no overhead",
  },
  {
    title: "Write well-scoped requests and put how much you can pay for it",
    img: "/logo3.png",
    description: "Wait for a claimant to complete your request",
  },
  {
    title: "Browse projects, do the work, make a claim",
    img: "/logo1.png",
    description: "Get paid for your work",
  },
];

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <p className="title">Rallypoint Bounties</p>
      <div className="text-foreground">
        {featureList.map((props, idx) => (
          <Feature
            key={idx}
            title={props.title}
            img={props.img}
            description={props.description}
          />
        ))}
      </div>
      <AllPostsList />
      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <a
          href="https://github.com/quinn-dougherty/rallypoint"
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
