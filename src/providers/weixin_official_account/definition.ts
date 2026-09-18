import type { ProviderDefinition } from "../../core/types.ts";

import { weixinOfficialAccountActions } from "./actions.ts";

const service = "weixin_official_account";

/**
 * WeChat Official Account provider backed by the WeChat Official Account Platform APIs.
 */
export const provider: ProviderDefinition = {
  service,
  displayName: "WeChat Official Account",
  description:
    "Manage temporary and permanent media, article drafts, publishing, and reader statistics, and send customer service, mass, and template messages for a WeChat Official Account through the WeChat Official Account Platform APIs. The runtime's public egress IP must be added to the account's IP whitelist (设置与开发 → 基本配置 → IP 白名单) at https://mp.weixin.qq.com, otherwise every call fails with errcode 40164.",
  categories: ["Communication", "Marketing"],
  authTypes: ["custom_credential"],
  auth: [
    {
      type: "custom_credential",
      description:
        "Add this runtime's public egress IP to the account's IP whitelist (设置与开发 → 基本配置 → IP 白名单) before connecting, otherwise every API call fails with errcode 40164.",
      fields: [
        {
          key: "appId",
          label: "AppID",
          inputType: "text",
          required: true,
          secret: false,
          description:
            "The AppID of the WeChat Official Account. Find it in 设置与开发 → 基本配置 at https://mp.weixin.qq.com.",
        },
        {
          key: "appSecret",
          label: "AppSecret",
          inputType: "password",
          required: true,
          secret: true,
          description:
            "The AppSecret of the same WeChat Official Account. Copy it from 设置与开发 → 基本配置 at https://mp.weixin.qq.com.",
        },
      ],
    },
  ],
  homepageUrl: "https://mp.weixin.qq.com",
  actions: weixinOfficialAccountActions,
};
