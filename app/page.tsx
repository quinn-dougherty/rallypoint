import Image from "next/image";
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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <p className="title">Rallypoint Bounties</p>
      <p className="text-foreground">Playmoney alpha</p>
      <div className="animate-in container row w-full flex flex-row items-center gap-8 text-foreground">
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
