import Image from "next/image";
import AllPostsList from "@/components/posts/AllPostsList";

interface FeatureItem {
  title: string;
  img: string;
  description: string;
}

const Feature: React.FC<FeatureItem> = ({ title, img, description }) => {
  return (
    <div
      className="flex flex-wrap items-center justify-center text-center p-4 md:p-8 bg-[var(--background)] rounded-lg w-full md:w-1/3 lg:w-1/3 relative"
      style={{
        outline: "1px solid hsl(var(--foreground))",
        outlineOffset: "-1px",
      }}
    >
      <h3 className="text-xl font-semibold mt-0 mb-2">{title}</h3>
      <p className="text-md mt-2 mb-4">{description}</p>
      <div className="relative w-full h-0 pb-[100%]">
        <Image
          src={img}
          alt={title}
          fill={true}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-lg"
        />
      </div>
      <div
        className="absolute bottom-0 left-0 w-full h-3/4"
        style={{
          backgroundImage:
            "linear-gradient(to top, hsl(var(--background)), transparent)",
        }}
      ></div>
    </div>
  );
};

const featureList: FeatureItem[] = [
  {
    title: "Lean and quick coordination of funds",
    img: "/logo5.png",
    description: "Find people to execute your ideas with low overhead.",
  },
  {
    title: "Browse projects, do the work, make a claim",
    img: "/logo3.png",
    description: "Get paid for your work efficiently and reliably.",
  },
];

const Index: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center gap-40 p-4 md:p-8"
      style={{ scrollPaddingTop: "calc(100vh - 5.5rem)" }}
    >
      <div className="text-center">
        <p className="text-5xl font-bold text-[var(--foreground)]">
          Rallypoint Bounties
        </p>
        <p className="text-xl text-[var(--foreground)] mt-4">
          <em>Early access, alpha testing with playmoney</em>
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 w-full">
        {featureList.map((feature, idx) => (
          <Feature
            key={idx}
            title={feature.title}
            img={feature.img}
            description={feature.description}
          />
        ))}
      </div>
      <AllPostsList />
    </div>
  );
};

export default Index;
