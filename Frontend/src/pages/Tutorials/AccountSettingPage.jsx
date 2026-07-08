import React from "react";
import AccountSetting from "../../components/Tutorials/AccountSetting";
import { PageLayout } from "@/components/dashboard/shared/Primitives";

function AccountSettingPage() {
  return (
    <PageLayout className="pb-8">
      <AccountSetting />
    </PageLayout>
  );
}

export default AccountSettingPage;
