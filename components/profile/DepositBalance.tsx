import { ProfilesModel } from "@/types/Models";

interface DepositBalanceProps {
  profile: ProfilesModel["Row"];
  amount: number;
}

function DepositBalance({ profile, amount }: DepositBalanceProps) {
  return (
    <div>
      {profile.lw_username} deposited {amount} (DUMMY)
    </div>
  );
}

export default DepositBalance;
