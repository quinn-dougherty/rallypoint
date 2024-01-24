interface ResolveClaimProps {
  award: number;
}

function ResolveClaim({ award }: ResolveClaimProps) {
  // need numeric field for percentage
  // need button to submit resolution
  // need all the business logic for that button
  return <div>{award}</div>;
}

export default ResolveClaim;
