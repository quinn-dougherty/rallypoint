import CaptionFadeImage from "@/components/CaptionFadeImage";
import AllPostsList from "@/components/posts/AllPostsList";

interface FeatureItem {
  title: string;
  img: string;
  description: string;
}

function Feature({ title, img, description }: FeatureItem) {
  return (
    <div className="flex flex-row sm:flex-col items-center justify-center sm:justify-start gap-4">
      <div className="w-1/2">
        <CaptionFadeImage src={img} title={title} caption={description} />
      </div>
    </div>
  );
}

const featureList: FeatureItem[] = [
  {
    title: "Lean and quick funding",
    img: "/logo5.png",
    description: "Find people to execute your ideas with low overhead",
  },
  {
    title: "Specify your request and name your price",
    img: "/logo3.png",
    description: "Wait for a claimant to complete your request",
  },
  {
    title: "Browse projects, do the work, make a claim",
    img: "/logo4.png",
    description: "Get paid for your work",
  },
];

export default async function Index() {
  return (
    <div
      className="w-full flex gap-20 items-center"
      style={{ scrollPaddingTop: "calc(100vh - 5.5rem)" }}
    >
      <p className="text-5xl">Rallypoint Bounties</p>
      <p className="text-foreground">
        <em>Early access, alpha testing with playmoney</em>
      </p>
      <div className="animate-in container md:row w-full flex md:flex-row sm:flex-col sm:col items-center gap-8 text-foreground">
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
    </div>
  );
}
