import type { ExecutionContext } from "../../core/types.ts";

import { afterEach, expect, it, vi } from "vitest";
import { executors } from "./executors.ts";

afterEach(() => vi.unstubAllGlobals());

it("uses the new category protocol and rejects string-valued WeChat errors", async () => {
  const categoryInfo = { cats_v2: [{ cat_id: 10 }, { cat_id: 20 }], license_group_list: [] };

  const requests: Request[] = [];
  vi.stubGlobal("fetch", async (url: string, init: RequestInit) => {
    requests.push(new Request(url, init));
    return Response.json(
      requests.length === 1
        ? { access_token: "token", expires_in: 7200 }
        : requests.length === 2
          ? { errcode: 0, audit_id: 42 }
          : { errcode: "10020094", errmsg: "qualification file required" },
    );
  });
  const context: ExecutionContext = {
    async getCredential() {
      return {
        authType: "custom_credential",
        values: { appId: "category-test-app", appSecret: "secret" },
        profile: { accountId: "category-test-app", displayName: "Test store", grantedScopes: [] },
        metadata: {},
      };
    },
  };

  const result = await executors["weixin_store.apply_category"]!({ categoryInfo }, context);
  expect(result).toEqual({ ok: true, output: { audit_id: 42 } });
  expect(new URL(requests[1]!.url).pathname).toBe("/channels/ec/category/add");
  expect(await requests[1]!.json()).toEqual({ category_info: { ...categoryInfo, is_new_apply_cat: true } });

  const failure = await executors["weixin_store.apply_category"]!({ categoryInfo }, context);
  expect(failure).toMatchObject({
    ok: false,
    error: { message: "WeChat API error 10020094: qualification file required" },
  });
});
