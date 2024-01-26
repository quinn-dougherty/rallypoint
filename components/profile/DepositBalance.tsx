import { ProfilesModel } from "@/types/Models";

interface DepositBalanceProps {
  profile: ProfilesModel["Row"];
  amount: number;
}

/// TODO: implement this
// This makes sense in escrow version, not so much otherwise
function DepositBalance({ profile, amount }: DepositBalanceProps) {
  return (
    <div>
      {profile.lw_username} deposited {amount} (DUMMY)
    </div>
  );
}

export default DepositBalance;
