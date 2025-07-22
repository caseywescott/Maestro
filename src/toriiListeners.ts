import { useEffect } from "react";

// Dynamically import SDK only when enabled
let useEntityQuery: any;
let ToriiQueryBuilder: any;
let MemberClause: any;

try {
  const sdkReact = require("@dojoengine/sdk/react");
  const sdk = require("@dojoengine/sdk");
  useEntityQuery = sdkReact.useEntityQuery;
  ToriiQueryBuilder = sdk.ToriiQueryBuilder;
  MemberClause = sdk.MemberClause;
} catch {
  // fallback for non-Torii usage
}

export function useCombatSceneListener(enabled: boolean, onCueTrigger: (cueId: string) => void) {
  useEffect(() => {
    if (!enabled || !useEntityQuery || !ToriiQueryBuilder || !MemberClause) return;

    const query = new ToriiQueryBuilder()
      .withClause(MemberClause("world-Scene", "type", "Eq", "combat"))
      .includeHashedKeys();

    useEntityQuery(query, {
      onData: (entities: any[]) => {
        if (entities.length > 0) {
          onCueTrigger("combatTheme"); // You could customize this per entity
        }
      },
    });
  }, [enabled, onCueTrigger]);
}
