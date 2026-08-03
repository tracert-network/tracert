// Shared adapter vocabulary — one definition so `instanceof` holds across the
// dispatcher and every adapter.
export type AdapterMode = "disabled" | "simulated" | "live";

export class AdapterRejection extends Error {
  constructor(public reasons: { code: string; message: string; field?: string }[]) {
    super(reasons[0]?.message ?? "rejected");
  }
}

export class AdapterFailure extends Error {
  constructor(
    public reasons: { code: string; message: string }[],
    public evidence: { type: string; [k: string]: unknown }[] = [],
  ) {
    super(reasons[0]?.message ?? "failed");
  }
}
