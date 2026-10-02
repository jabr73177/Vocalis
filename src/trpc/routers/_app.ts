import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  health: baseProcedure.query(async () => {
    return { satus: "ok", code: 123 };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
